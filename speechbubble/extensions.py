from flask.ext.mongoengine import MongoEngine
from flask.ext import restful

db = MongoEngine()
api = restful.Api()

