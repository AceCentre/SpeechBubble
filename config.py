# config.py
from os.path import abspath, dirname, join

_cwd = dirname(abspath(__file__))

SECRET_KEY = 'flask-session-insecure-secret-key'

DEBUG = True

GOOGLE_ANALYTICS_CODE = ''

# MongoDB Config
MONGODB_DB = 'speechbubble'
MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017

# Flask-security settings
#SECURITY_CONFIRMABLE = True
SECURITY_REGISTERABLE = True
SECURITY_RECOVERABLE = True
SECURITY_CHANGEABLE = True

PRODUCT_VERSION_HISTORY_MAX = 10
