import datetime as dt
import copy

from flask import render_template, current_app
from flask.ext.security import UserMixin, RoleMixin

import slugify

from .app import db

from .extensions import mandrill


from .field_choices import (PRODUCT_TYPE_HARDWARE,
                            PRODUCT_HARDWARE_SUBTYPE_LOWTECH,
                            PRODUCT_HARDWARE_SUBTYPE_SIMPLE,
                            PRODUCT_HARDWARE_SUBTYPE_ADVANCED,
                            PRODUCT_TYPE_APP,
                            PRODUCT_TYPE_VOCABULARY)


from .forms import (HardwareLowtechForm,
                    HardwareSimpleForm,
                    HardwareAdvancedForm,
                    SoftwareForm,
                    VocabularyForm)


class ModerationError(Exception):
    pass


class PermissionError(Exception):
    pass


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


class ModerationQueue(db.Document):
    request_timestamp = db.DateTimeField(default=dt.datetime.now, required=True)
    review_timestamp = db.DateTimeField(default=None)

    product = db.ReferenceField('Product')
    version_owner = db.ReferenceField('User')
    increment_id = db.IntField()

    reviewer = db.ReferenceField('User')

    # some product data required to dis play on the moderation page
    product_type = db.StringField()
    product_sub_type = db.StringField()
    product_url = db.StringField()
    product_name = db.StringField()

    status = db.StringField(default=None)   # published, rejected - mongoengine needs an enum field!

    def get_product_and_draft(self):
        product = Product.objects.get(id=self.product.id)

        for item in product.drafts:
            if item.owner == self.version_owner:
                draft = item
                break
        else:
            raise IndexError('Missing product draft')

        return product, draft

    @classmethod
    def get_entry(cls, product, user):
        """
        Get the moderation entry for this product/user and if it doesn't
        exist, return False
        """

        try:
            return cls.objects.get(product=product, version_owner=user.id)
        except cls.DoesNotExist:
            return False

    @classmethod
    def has_entry(cls, product, user):
        return len(cls.objects(product=product, version_owner=user.id)) > 0

    @classmethod
    def create_moderation_request(cls, product, draft):
        if cls.objects(product=product, version_owner=draft.owner.id):
            raise ModerationError('Entry already exists')

        moderation = cls(
            product=product, version_owner=draft.owner, increment_id=draft.increment_id,
            product_type=product.type, prduct_sub_type=product.sub_type, product_url=product.url,
            product_name=draft.data.get('name', 'No name specified!'))

        moderation.save()

        return moderation

    def send_moderators_email(self):
        moderators = User.get_all_moderators()

        body = render_template("emails/request.txt")

        if moderators:
            mandrill.send_email(
                from_email=current_app.config['MANDRILL_DEFAULT_FROM'],
                to=[dict(email=user.email) for user in moderators],
                text=body,
                #html=message.html,
                subject=current_app.config['EMAIL_MODERATION_REQUEST_SUBJECT']
            )

    def send_action_email(self):

        mandrill.send_email(
            from_email=current_app.config['MANDRILL_DEFAULT_FROM'],
            to=[dict(email=user.email) for user in moderators],
            text=body,
            #html=message.html,
            subject=current_app.config['EMAIL_MODERATION_REQUEST_SUBJECT']
        )


class Comment(db.EmbeddedDocument):
    """
    A moderation comment
    """
    created_at = db.DateTimeField(default=dt.datetime.now, required=True)
    body = db.StringField(verbose_name="Comment", required=True)
    author = db.StringField(verbose_name="Name", max_length=255, required=True)


class Image(db.EmbeddedDocument):
    """
    A product image
    """
    path = db.StringField(required=True)
    caption = db.StringField()
    ordering = db.IntField(default=0)


class ProductVersion(db.EmbeddedDocument):

    created_timestamp = db.DateTimeField(default=dt.datetime.now, required=True)
    last_updated = db.DateTimeField(default=dt.datetime.now, required=True)

    owner = db.ReferenceField(User, required=True)
    increment_id = db.IntField(required=True, default=0)   # (unique_with="owner",

    moderation_notes = db.ListField(Comment)

    data = db.DictField()

    def get_stats(self):
        """
        Return a dict of json-able document stats
        that appear in the right pane, e.g. owner,
        contributors etc.
        """

        return dict(owner=self.owner.get_full_name(),
                    created=self.created_timestamp.strftime("%b %d %Y %H:%M:%S"),
                    updated=self.last_updated.strftime("%b %d %Y %H:%M:%S"))

    def update(self, data, user):
        self.data = data
        self.add_to_contributors(user)
        self.last_updated = dt.datetime.now()


class Product(db.Document):
    url = db.StringField(required=True)
    type = db.StringField(required=True)
    sub_type = db.StringField()

    drafts = db.ListField(db.EmbeddedDocumentField('ProductVersion'))
    published = db.EmbeddedDocumentField('ProductVersion')
    history = db.ListField(db.EmbeddedDocumentField('ProductVersion'))

    updated_timestamp = db.DateTimeField()

    def __unicode__(self):
        return self.url

    @classmethod
    def create_new(cls, name, product_type, product_sub_type, user):
        """
        Create a new product
        """

        url = "/" + slugify.slugify(name)

        product = cls(url=url, type=product_type,
                      sub_type=product_sub_type)

        # set up a new draft product

        data = dict(name=name)

        product.drafts.append(ProductVersion(owner=user.id, increment_id=1, data=data))
        product.save()

        return product

    def _make_diff(self):
        # determine changed fields between this object and its immediate parent
        pass

    def publish(self, draft_id):
        """
        Publish the draft. If an item is already published it gets pushed into history
        """

        self.archive_published()

        if not self.draft:
            raise ModerationError("Nothing to publish!")

        self.published = copy.deepcopy(self.draft)
        self.save()

    def get_or_create_draft(self, user):

        try:
            return self.get_draft(user)
        except IndexError:
            return self.create_draft(user)

    def get_draft(self, user):

        for item in self.drafts:
            if item.owner.id == user.id:
                return item
        else:
            raise IndexError("Draft does not exist")

    def create_draft(self, user):
        """
        Copy published to draft
        """

        if not self.published:
            draft = ProductVersion()
            draft.name = "Untitled {}".format(self.type)
        else:
            draft = copy.deepcopy(self.published)

        draft.moderation_notes = []
        draft.owner = user.to_dbref()
        draft.increment_id += 1

        self.drafts.append(draft)

        self.save()

        return draft

    def delete_draft(self, user_id):
        draft = self.get_draft(user_id)

        self.drafts.remove(draft)
        self.save()


    def archive_published(self, save=False):
        """
        Archive the
        """
        if not self.published:
            raise ModerationError("Nothing to archive")

        self.history.append(copy.deepcopy(self.published))

        if len(self.history) > app.config['PRODUCT_VERSION_HISTORY_MAX']:
            index = len(self.history) - app.config['PRODUCT_VERSION_HISTORY_MAX']

            self.history = self.history[index:]

        if save:
            self.save()

    def get_primary_image(self):
        """
        Get the product's primary image or return a placeholder.
        """
        try:
            image = self['published']['images'][0]['url']
        except (KeyError, IndexError):
            return "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNDAiIGhlaWdodD0iMTQwIj48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjcwIiB5PSI3MCIgc3R5bGU9ImZpbGw6I2FhYTtmb250LXdlaWdodDpib2xkO2ZvbnQtc2l6ZToxMnB4O2ZvbnQtZmFtaWx5OkFyaWFsLEhlbHZldGljYSxzYW5zLXNlcmlmO2RvbWluYW50LWJhc2VsaW5lOmNlbnRyYWwiPjE0MHgxNDA8L3RleHQ+PC9zdmc+"

    def get_form(self):
        """
        A form factory to centralise form selection
        """
        if self.type == PRODUCT_TYPE_HARDWARE:
            if self.sub_type == PRODUCT_HARDWARE_SUBTYPE_LOWTECH:
                return HardwareLowtechForm

            elif self.sub_type == PRODUCT_HARDWARE_SUBTYPE_SIMPLE:
                return HardwareSimpleForm

            elif self.sub_type == PRODUCT_HARDWARE_SUBTYPE_ADVANCED:
                return HardwareAdvancedForm

        elif self.type == PRODUCT_TYPE_APP:
            return SoftwareForm

        elif self.type == PRODUCT_TYPE_VOCABULARY:
            return VocabularyForm

        raise Exception("Invalid product type/sub type values")

    @property
    def is_new(self):
        """
        Is this a new product
        """
        return not self.product.published

    def get_type_name(self):
        """
        Return a human readable type name, e.g. Hardware (low tech)
        """

        types = {
            PRODUCT_TYPE_APP: 'Software / App',
            PRODUCT_TYPE_VOCABULARY: 'Vocabulary'
        }

        hardware_types = {
            PRODUCT_HARDWARE_SUBTYPE_LOWTECH: "Hardware (Low tech)",
            PRODUCT_HARDWARE_SUBTYPE_SIMPLE: "Hardware (Simple)",
            PRODUCT_HARDWARE_SUBTYPE_ADVANCED: "Hardware (Advanced)",
        }

        if self.type == PRODUCT_TYPE_HARDWARE:
            return hardware_types[self.sub_type]
        else:
            return types[self.type]





