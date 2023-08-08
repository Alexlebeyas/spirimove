from .base_settings import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

INSTALLED_APPS += ["sslserver",]

ALLOWED_HOSTS = ['127.0.0.1']
PROJECT_PROTOCOL = 'http://'
PROJECT_DOMAIN = ''
PROJECT_URI = "".join((PROJECT_PROTOCOL, PROJECT_DOMAIN))

AZURE_ACCOUNT_NAME = ""
AZURE_ACCOUNT_KEY = ""
AZURE_MEDIA_CONTAINER_NAME = ""
AZURE_URL_EXPIRATION_SECS = ""
