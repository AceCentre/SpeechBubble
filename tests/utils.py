from flask.ext.testing import TestCase

from speechbubble import create_app, configure_app
from speechbubble.extensions import db

from .factories import RoleFactory

__all__ = ['BaseTestCase']


class SBBaseTestCase(TestCase):
    def create_app(self):
        import pdb; pdb.set_trace()
        app = create_app(testing=True)
        configure_app(app)

        return app


class SBBaseMongoTestCase(SBBaseTestCase):

    def setUp(self):
        import pdb; pdb.set_trace()
        RoleFactory(name='Admin').save()
        RoleFactory(name='Moderator').save()


    def tearDown(self):
        # truncate collections - note this is unlikely to be optimal

        db_name = app.config['MONGODB_SETTINGS']['db']

        # sanity check...
        assert 'test' in db_name

        for collection in db.connection[db_name].collection_names():
            db.connection[db_name][collection].remove()

