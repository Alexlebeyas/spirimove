from .settings import *

ALLOWED_HOSTS = ['spiri_move.spiria.com']  # TODO add allowed hosts
PROJECT_PROTOCOL = 'https://'
PROJECT_DOMAIN = ''  # TODO add production domain
PROJECT_URI = "".join((PROJECT_PROTOCOL, PROJECT_DOMAIN))
SECRET_KEY = os.environ['SECRET_KEY']

DEBUG = TEMPLATE_DEBUG = False

MIDDLEWARE += ('whitenoise.middleware.WhiteNoiseMiddleware',)

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
SECURE_BROWSER_XSS_FILTER =True
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


COMPRESS_ENABLED = True
COMPRESS_OFFLINE = True
COMPRESS_CSS_HASHING_METHOD = 'content'
COMPRESS_FILTERS = {
    'css':[
        'compressor.filters.css_default.CssAbsoluteFilter',
        'compressor.filters.cssmin.rCSSMinFilter',
    ],
    'js':[
        'compressor.filters.jsmin.JSMinFilter',
    ]
}

HTML_MINIFY = True
JS_MINIFY = True
KEEP_COMMENTS_ON_MINIFYING = False
CONSERVATIVE_WHITESPACE_ON_MINIFYING = False
