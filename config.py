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
    MONGODB_SETTINGS['db'] = 'speechbubble'
    MONGODB_SETTINGS['host'] = 'localhost'
    MONGODB_SETTINGS['port'] = 27017
else:
    MONGODB_SETTINGS['host'] = MONGO_URI

# Flask-security settings
#SECURITY_CONFIRMABLE = True
SECURITY_REGISTERABLE = True
SECURITY_RECOVERABLE = True
SECURITY_CHANGEABLE = True

PRODUCT_VERSION_HISTORY_MAX = 10
