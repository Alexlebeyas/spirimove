"""
It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/howto/deployment/wsgi/
"""

from os import path, environ
from django.core.wsgi import get_wsgi_application

spiri_move = path.basename(path.dirname(__file__))
environ.setdefault("DJANGO_SETTINGS_MODULE", "%s.settings" % spiri_move)

application = get_wsgi_application()
