from __future__ import unicode_literals
from collections import OrderedDict

from .fields import BaseField


class DeclarativeFieldsMetaclass(type):
    def __new__(cls, name, bases, attrs):
        fields = [(field_name, attrs[field_name]) for field_name, obj
                  in list(attrs.iteritems()) if isinstance(obj, BaseField)]

        fields = sorted(fields, key=lambda field: field[1]._field_index)

        attrs['_fields'] = OrderedDict(fields)

        for key, field in fields:
            field._key = key

        new_class = super(DeclarativeFieldsMetaclass,
                     cls).__new__(cls, name, bases, attrs)

        return new_class


class ConditionalForm(object):
    __metaclass__ = DeclarativeFieldsMetaclass

    def __init__(self, form_data=None):
        self.angular_model_name = "form_data"
        self.errors = {}
        self.data = self.initial_data()

        if form_data is not None:
            self.process(form_data)

    def __iter__(self):
        for _, field in self._fields.iteritems():
            yield field

    def initial_data(self):

        data = {}

        for field in self:
            initial = field.initial

            if initial is not None:
                data[field._key] = initial

        return data

    def process(self, form_data, ignore_validation=False):
        """

        """

        #import pdb; pdb.set_trace()

        for field in self:
            #if field._key == "discontinued":
            #   import pdb; pdb.set_trace()
            field.process(form_data, self.data)

            if field.is_visible():
                if field.is_valid and not ignore_validation:
                    self.data[field._key] = field.data
                else:
                    self.errors[field._key] = field.error

    @property
    def is_valid(self):
        return not self.errors



