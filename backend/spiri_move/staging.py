import os
from .settings import *
import dj_database_url

ALLOWED_HOSTS = ['call-app-demo.herokuapp.com']  # TODO add allowed hosts
PROJECT_PROTOCOL = 'https://'
PROJECT_DOMAIN = ''  # TODO add staging domain
PROJECT_URI = "".join((PROJECT_PROTOCOL, PROJECT_DOMAIN))
SECRET_KEY = os.environ['SECRET_KEY']

DEBUG = True

SESSION_ENGINE = "django.contrib.sessions.backends.cache"
SESSION_CACHE_ALIAS = "default"

DATABASES = {'default': dj_database_url.config()}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'stderr': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['stderr'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
