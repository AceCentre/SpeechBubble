import datetime as dt
import copy

import slugify

from . import app, db
from .auth import User


class ModerationError(Exception):
    pass


class ModerationQueue(db.EmbeddedDocument):
    request_timestamp = db.DateTimeField(default=dt.datetime.now, required=True)

    #requester

    #status


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
    name = db.StringField(required=True)
    created_timestamp = db.DateTimeField(default=dt.datetime.now, required=True)
    author = db.ReferenceField(User)

    data = db.DictField()


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
        product.draft = ProductVersion(name=name, user=user)

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