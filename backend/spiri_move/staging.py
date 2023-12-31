from .base_settings import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

ALLOWED_HOSTS = ['']
PROJECT_PROTOCOL = 'https://'
PROJECT_DOMAIN = ''
PROJECT_URI = "".join((PROJECT_PROTOCOL, PROJECT_DOMAIN))

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

SESSION_EXPIRE_AT_BROWSER_CLOSE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True

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

# Files Storage settings
DEFAULT_FILE_STORAGE = 'spiri_move.azure_storage.AzureMediaStorage'
MEDIA_LOCATION = "staging"
AZURE_ACCOUNT_NAME = "spirimovestorage"
AZURE_ACCOUNT_KEY = os.environ.get('AZURE_ACCOUNT_KEY')
AZURE_CUSTOM_DOMAIN = f'{AZURE_ACCOUNT_NAME}.blob.core.windows.net'
MEDIA_URL = f'https://{AZURE_CUSTOM_DOMAIN}/{MEDIA_LOCATION}/'
AZURE_OVERWRITE_FILES = False
AZURE_MEDIA_CONTAINER_NAME = "spiri-pictures"
AZURE_URL_EXPIRATION_SECS = 30
