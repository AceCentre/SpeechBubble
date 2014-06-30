# config.py
from os.path import abspath, dirname, join

import envdir
envdir.open()

_cwd = dirname(abspath(__file__))

SECRET_KEY = 'flask-session-insecure-secret-key'

GOOGLE_ANALYTICS_CODE = ''

# MongoDB Config
MONGODB_DB = 'acecentre'
MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017

# Flask-security settings
#SECURITY_CONFIRMABLE = True
SECURITY_REGISTERABLE = True
SECURITY_RECOVERABLE = True
SECURITY_CHANGEABLE = True
