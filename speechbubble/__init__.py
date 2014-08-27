from flask import Flask
from flask_bootstrap import Bootstrap
from flask.ext.triangle import Triangle


from .extensions import db, api


def create_app(testing=False):
    app = Flask(__name__)

    app.config.from_object('config')

    if testing:
        # use a test database
        app.config['MONGODB_SETTINGS']['db'] = "test-" + app.config['MONGODB_SETTINGS']['db']

    return app


def configure_app(app):
    Bootstrap(app)
    Triangle(app)

    db.init_app(app)
    api.init_app(app)

    return app


app = create_app()
app = configure_app(app)
