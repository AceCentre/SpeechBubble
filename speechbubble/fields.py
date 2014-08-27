from __future__ import unicode_literals


class FieldDataIntegrityError(Exception):
    """
    A different class of exception
    """

class ValidationError(Exception):
    pass


class BaseField(object):
    """
    The base field type
    """

    _field_index = 0

    def __init__(self, label, default=None, validators=None, display_rule=None, required=False):

        self.default = default
        self.label = label
        self.display_rule = display_rule
        self.validators = validators
        self.required = required

        # Keep track of instance creation index so fields
        # can be ordered.
        BaseField._field_index += 1
        self._field_index = BaseField._field_index

        # 'key' is the index in the document, and the key in the
        # data model in angular. It also doubles as the field's HTML id
        # It is set in BranchedForm.__init__
        self._key = None

        self._data = {}
        self.errors = []

    def set_data(self, data):
        """
        Set the data for the field. E.g. pass in a reference to the current document.

        :param data: the document/data
        """

        self._data = data

    def process_data(self, form_data):
        """
        Take the form data validate it, and if valid occupy the document

        :param form_data:
        :return:
        """

        raise NotImplementedError

    @property
    def is_visible(self):
        """
        Should this field be visible?
        """

        if not self.display_rule:
            # no rule, so it is visible by default
            return True

        key, comp, value = self.display_rule

        if comp == "eq":
            return self._data.get(key, None) == value
        else:
            return self._data.get(key, None) != value

    @property
    def is_valid(self):
        if not self.is_visible:
            # always valid - but should we raise an exception here?
            return True

        return self.required and self._data.get(self._key, None) is not None


class IntegerField(BaseField):
    pass


class ChoiceField(BaseField):
    def __init__(self, *args, **kwargs):

        self._choices = kwargs.pop('choices')

        super(ChoiceField, self).__init__(*args, **kwargs)

    def validate(self):
        pass
        #selected_opts = self.data.get(self.


class MultipleChoiceField(BaseField):
    def __init__(self, *args, **kwargs):

        self._choices = kwargs.pop('choices')

        super(MultipleChoiceField, self).__init__(*args, **kwargs)

    def validate(self):
        pass
        #selected_opts = self.data.get(self.


class MultiChoiceField(BaseField):
    pass


class TextField(BaseField):
    pass


class YesNoField(ChoiceField):
    def __init__(self, *args, **kwargs):

        kwargs.pop('choices', None)

        choices = ((True, 'Yes'), (False, 'No'))

        super(YesNoField, self).__init__(*args, choices=choices, **kwargs)



