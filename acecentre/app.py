from flask import Flask
from flask_bootstrap import Bootstrap
from flask.ext.mongoengine import MongoEngine


def create_app():
    app = Flask(__name__)
    app.config.from_object('config')

    Bootstrap(app)

    return app

app = create_app()
db = MongoEngine(app)







