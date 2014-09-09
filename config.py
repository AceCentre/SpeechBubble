# config.py
import os

MONGO_URI = os.environ.get('MONGOHQ_URL', None)

_cwd = os.path.dirname(os.path.abspath(__file__))

SECRET_KEY = 'flask-session-insecure-secret-key'

DEBUG = True

GOOGLE_ANALYTICS_CODE = ''

MONGODB_SETTINGS = {}

# MongoDB Config
if not MONGO_URI:
    MONGODB_SETTINGS['db'] = 'acecentre'
    MONGODB_SETTINGS['host'] = 'localhost'
    MONGODB_SETTINGS['port'] = 27017
else:
    MONGODB_SETTINGS['db'] = MONGO_URI.split("/")[-1]
    MONGODB_SETTINGS['host'] = MONGO_URI

# Flask-security settings
SECURITY_CONFIRMABLE = True
SECURITY_REGISTERABLE = True
SECURITY_RECOVERABLE = True
SECURITY_CHANGEABLE = True
SECURITY_FLASH_MESSAGES = True
SECURITY_TRACKABLE = True

PRODUCT_VERSION_HISTORY_MAX = 10

MANDRILL_API_KEY = 'z0Ht0kHJdGPYrAXGFR1D4A'
MANDRILL_DEFAULT_FROM = 'lyndon@antlyn.com'