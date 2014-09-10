from flask.ext.security import UserMixin, RoleMixin

from . import db


class Role(db.Document, RoleMixin):
    name = db.StringField(max_length=80, unique=True)
    description = db.StringField(max_length=255)

    def __unicode__(self):
        return self.name


class User(db.Document, UserMixin):
    email = db.StringField(max_length=255)
    password = db.StringField(max_length=255)
    active = db.BooleanField(default=True)
    roles = db.ListField(db.ReferenceField(Role), default=[])

    # tracking
    confirmed_at = db.DateTimeField()
    last_login_at = db.DateTimeField()
    current_login_at = db.DateTimeField()
    last_login_ip = db.StringField()
    current_login_ip = db.StringField()
    login_count = db.IntField()

    first_name = db.StringField()
    last_name = db.StringField()
    registration_type = db.StringField()
    region = db.StringField()
    city = db.StringField()
    mailing_list = db.BooleanField()

    def __unicode__(self):
        return self.email

    @property
    def can_moderate(self):
        return self.has_role('Admin') or self.has_role('Moderator')

    def populate_from_form(self, form):
        self.email = form.data['email']

        self.roles = Role.objects(id__in=form.data['roles'])

        if form.data['password']:
            self.password = form.data['password']

        self.active = form.data['active']
        self.save()

    def get_full_name(self):
        return "{} {}".format(self.first_name, self.last_name)

    @classmethod
    def get_all_moderators(cls):
        """
        Return all users that have moderator or admin credentials
        """
        roles = Role.objects(name__in=['Admin', 'Moderator'])
        return User.objects(roles__in=roles)



