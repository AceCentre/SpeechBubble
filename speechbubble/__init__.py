from flask import Flask
from flask_bootstrap import Bootstrap
from flask.ext.mongoengine import MongoEngine
from flask.ext.triangle import Triangle
from flask.ext import restful


def create_app():
    app = Flask(__name__)
    app.config.from_object('config')

    Bootstrap(app)

    return app

app = create_app()
Triangle(app)
db = MongoEngine(app)
api = restful.Api(app)

