from rest_framework import authentication
from rest_framework import HTTP_HEADER_ENCODING, exceptions
from django.utils.translation import gettext_lazy as _
import requests
from .exceptions import WrongTokenException
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.contrib.auth import get_user_model

def get_authorization_header(request):
    """
    Return request's 'Authorization:' header, as a bytestring.

    Hide some test client ickyness where the header can be unicode.
    """
    auth = request.META.get('HTTP_AUTHORIZATION', b'')
    if isinstance(auth, str):
        # Work around django test client oddness
        auth = auth.encode(HTTP_HEADER_ENCODING)
    return auth

def get_microsoft_info(access_token):
    r = requests.get(r'https://graph.microsoft.com/v1.0/me/', headers={'Authorization': f'Bearer {access_token}'})
    return r.json()

def get_user_by_email(email):
    user = get_user_model().objects.filter(email=email)
    if not user:
        return None

    return user[0]

class Authentication(authentication.BaseAuthentication):
    def authenticate(self, request):

        auth = get_authorization_header(request).split()

        if not auth or auth[0].lower() != b'bearer':
            return None

        if len(auth) == 1:
            msg = _('Invalid basic header. No credentials provided.')
            raise exceptions.AuthenticationFailed(msg)
        elif len(auth) > 2:
            msg = _('Invalid basic header. Credentials string should not contain spaces.')
            raise exceptions.AuthenticationFailed(msg)

        tokens = auth[1].decode("utf-8")

        try:
            microsoft_info = get_microsoft_info(tokens)
        except KeyError:
            raise WrongTokenException()

        if 'error' in microsoft_info:
            raise exceptions.AuthenticationFailed(_('No such user'))

        user = get_user_by_email(microsoft_info['mail'] or microsoft_info['userPrincipalName'])
        if not user:
            # User not found in the system, we should create a new user
            user = get_user_model().objects.create_user(
                                            email=(microsoft_info['mail'] or microsoft_info['userPrincipalName']),
                                            phone=microsoft_info['businessPhones'],
                                            office=microsoft_info['officeLocation'],
                                            display_name=microsoft_info['displayName'],
                                            password=get_random_string(length=12),
                                            first_name=microsoft_info.get('givenName', ''),
                                            last_name=microsoft_info.get('surname', ''))

        if not user.is_active:
            raise exceptions.AuthenticationFailed(_('No such user'))

        user.last_login = timezone.now()
        user.save()

        return user, None
