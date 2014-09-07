from __future__ import unicode_literals


__all__ = ['IntegerField', 'ChoiceField', 'MultipleChoiceField', 'TextField', 'YesNoField']


class ValidationError(Exception):
    """
    A custom field validation error
    """


class BaseField(object):
    """
    The base field type
    """

    _field_index = 0

    def __init__(self, label, default=None,display_rule=None, required=False):

        self.default = default
        self.label = label
        self.display_rule = display_rule
        self.required = required

        # Keep track of instance creation index so fields
        # can be ordered.
        BaseField._field_index += 1
        self._field_index = BaseField._field_index

        # 'key' is the index in the document, and the key in the
        # data model in angular. It also doubles as the field's HTML id
        # It is set in BranchedForm.__init__
        self._key = None

        self.data = {}
        self.error = None

    def process(self, form_data, processed_data):
        """
        Take the form data validate it
        """

        self.data = {}
        self._form_data = form_data
        self._processed_data = processed_data

        if self.is_visible():
            try:
                field_data = self.validate()
            except ValidationError as ex:
                self.error = unicode(ex)
            else:
                self.data = field_data

    def is_visible(self):
        """
        Is this field displayed to the user?
        """

        if not self.display_rule:
            # no rule, so it is visible by default
            return True

        key, comp, value = self.display_rule

        if comp == "eq":
            return self._processed_data.get(key, None) == value
        else:
            return self._processed_data.get(key, None) != value

    @property
    def is_valid(self):
        return not self.error

    def validate(self):
        field_data = self._form_data.get(self._key, "")

        if self.required:
            if not field_data:
                raise ValidationError("This field is required")

        return field_data


class IntegerField(BaseField):

    def validate(self):
        field = super(IntegerField, self).is_valid()

        try:
            int(field)
        except ValueError:
            raise ValidationError("Field must be an integer value, e.g. 123")

        return field


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
    def __init__(self, *args, **kwargs):
        self._max_chars = kwargs.pop('max_chars', 255)

        super(TextField, self).__init__(*args, **kwargs)


class YesNoField(ChoiceField):
    def __init__(self, *args, **kwargs):

        kwargs.pop('choices', None)

        choices = ((True, 'Yes'), (False, 'No'))

        super(YesNoField, self).__init__(*args, choices=choices, **kwargs)



