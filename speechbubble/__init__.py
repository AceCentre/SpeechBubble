from flask import Flask
from flask.ext.triangle import Triangle
from flask.ext import restful

from flask.ext.security import MongoEngineUserDatastore

from .mail import MandrillMail
from .extensions import db, api, mandrill, bootstrap, user_datastore, security

from .forms import User, Role, SpeechBubbleRegisterForm


def create_app(testing=False):
    app = Flask(__name__)

    app.config.from_object('config')

    if testing:
        # use a test database
        app.config['MONGODB_SETTINGS']['db'] = \
            "test-" + app.config['MONGODB_SETTINGS']['db']

    return app


app = create_app()

from .api_views import ProductController, ProductCreateController

def configure_app(app):
    bootstrap.init_app(app)
    Triangle(app)

    db.init_app(app)
    api.init_app(app)
    mandrill.init_app(app)

    # Setup Flask-Security
    user_datastore = MongoEngineUserDatastore(db, User, Role)
    security.init_app(app, user_datastore, confirm_register_form=SpeechBubbleRegisterForm)

    # register mandrill substitute to flask mail
    # as an extension, so that flask security
    # routes emails through mandrill and not smtp
    app.extensions = getattr(app, 'extensions', {})
    app.extensions['mail'] = MandrillMail()

configure_app(app)

