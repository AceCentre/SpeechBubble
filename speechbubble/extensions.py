from flask.ext.mongoengine import MongoEngine
db = MongoEngine()

from flask.ext import restful
api = restful.Api()

from flask.ext.mandrill import Mandrill
mandrill = Mandrill()

from flask_bootstrap import Bootstrap
bootstrap = Bootstrap()

# flask security
from flask.ext.security import Security
security = Security()