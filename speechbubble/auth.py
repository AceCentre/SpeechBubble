from flask.ext.security import Security, MongoEngineUserDatastore, \
    UserMixin, RoleMixin

from . import app, db


class Role(db.Document, RoleMixin):
    name = db.StringField(max_length=80, unique=True)
    description = db.StringField(max_length=255)

    def __unicode__(self):
        return self.name


class User(db.Document, UserMixin):
    email = db.StringField(max_length=255)
    password = db.StringField(max_length=255)
    active = db.BooleanField(default=True)
    confirmed_at = db.DateTimeField()
    roles = db.ListField(db.ReferenceField(Role), default=[])

    def __unicode__(self):
        return self.email

    @property
    def can_moderate(self):
        return self.has_role('Admin') or self.has_role('Moderator')


# Setup Flask-Security
user_datastore = MongoEngineUserDatastore(db, User, Role)
security = Security(app, user_datastore)
