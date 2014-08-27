from flask.ext.testing import TestCase

from speechbubble import create_app, configure_app

__all__ = ['BaseTestCase']


class BaseTestCase(TestCase):
    def create_app(self):
        app = create_app(testing=True)
        return configure_app(app)