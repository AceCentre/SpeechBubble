import datetime as dt
import copy

from flask import render_template

import slugify

from . import app, db
from .auth import User
from .extensions import mandrill


from .field_choices import (PRODUCT_TYPE_HARDWARE,
                            PRODUCT_HARDWARE_SUBTYPE_LOWTECH,
                            PRODUCT_HARDWARE_SUBTYPE_SIMPLE,
                            PRODUCT_HARDWARE_SUBTYPE_ADVANCED,
                            PRODUCT_TYPE_APP,
                            PRODUCT_TYPE_VOCABULARY)


from .branched_forms import (HardwareLowtechForm,
                             HardwareSimpleForm,
                             HardwareAdvancedForm,
                             SoftwareForm,
                             VocabularyForm)


class ModerationError(Exception):
    pass


class ModerationQueue(db.Document):
    request_timestamp = db.DateTimeField(default=dt.datetime.now, required=True)
    review_timestamp = db.DateTimeField(default=None)

    product = db.ReferenceField('Product')
    reviewed_by = db.ReferenceField('User')

    status = db.StringField(default=None)   # published, rejected - mongoengine needs an enum field!

    @classmethod
    def create_moderation_request(cls, product):
        if cls.objects(product=product, status=None):
            raise ModerationError('Entry already exists')

        modreq = cls(product=product)
        modreq.save()

        return modreq

    def send_moderators_email(self):
        moderators = User.get_all_moderators()

        subject = "SpeechBubble: New moderation request!"
        body = render_template("emails/request.txt")

        if moderators:
            mandrill.send_email(
                from_email=app.config['MANDRILL_DEFAULT_FROM'],
                to=[dict(email=user.email) for user in moderators],
                text=body,
                #html=message.html,
                subject=app.config['EMAIL_MODERATION_REQUEST_SUBJECT']
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


class Contributor(db.EmbeddedDocument):
    user = db.ReferenceField(User)
    name = db.StringField()
    notify = db.BooleanField(default=True)


class ProductVersion(db.EmbeddedDocument):
    name = db.StringField(required=True)
    created_timestamp = db.DateTimeField(default=dt.datetime.now, required=True)
    last_updated = db.DateTimeField(default=dt.datetime.now, required=True)

    owner = db.EmbeddedDocumentField(Contributor)
    contributors = db.ListField(db.EmbeddedDocumentField(Contributor))

    # should be incremented on each save; will be used
    # for optimistic locking
    sub_version_number = db.IntField(default=1)

    data = db.DictField()

    def get_stats(self):
        """
        Return a dict of json-able document stats
        that appear in the right pane, e.g. owner,
        contributors etc.
        """

        return dict(owner=self.owner.name,
                    contributors=self.contributors_name_list(),
                    created=self.created_timestamp.strftime("%b %d %Y %H:%M:%S"),
                    updated=self.last_updated.strftime("%b %d %Y %H:%M:%S"))

    def update(self, data, user):
        self.data = data
        self.add_to_contributors(user)
        self.last_updated = dt.datetime.now()

    def contributors_name_list(self):
        return ", ".join(contrib.name for contrib in self.contributors) or "No contributors"

    def add_to_contributors(self, user):
        """
        If a document is being saved add the user to the contributors list,
        if the user isn't the owner, or already in there.
        """
        if self.owner.user != user:
            if not filter(lambda x: x.user.id == user.id, self.contributors):
                contrib = Contributor(user=user.id, name=user.get_full_name())
                self.contributors.append(contrib)


class Product(db.Document):
    url = db.StringField(required=True)
    type = db.StringField(required=True)
    sub_type = db.StringField()

    draft = db.EmbeddedDocumentField('ProductVersion')
    published = db.EmbeddedDocumentField('ProductVersion')
    history = db.ListField(db.EmbeddedDocumentField('ProductVersion'))

    moderation_notes = db.ListField(Comment)

    updated_timestamp = db.DateTimeField()

    def __unicode__(self):
        return self.url


    @classmethod
    def create_new(cls, name, product_type, product_sub_type, user):
        """
        Create a new product
        """

        url = slugify.slugify(name)

        product = cls(url=url, type=product_type,
                      sub_type=product_sub_type, name=name)

        # set up a new draft product
        product.draft = ProductVersion(name=name)
        product.draft.owner = Contributor(name=user.get_full_name(), user=user.id)

        product.save()

        return product

    def _make_diff(self):
        # determine changed fields between this object and its immediate parent
        pass

    def publish(self):
        """
        Publish the draft. If an item is already published it gets pushed into history
        """

        self.archive_published()

        if not self.draft:
            raise ModerationError("Nothing to publish!")

        self.published = copy.deepcopy(self.draft)
        self.save()

    def create_draft(self):
        """
        Copy published to draft
        """

        if not self.published:
            raise ModerationError("No published item so unable to create draft")

        self.moderation_notes = []

        self.draft = copy.deepcopy(self.published)
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