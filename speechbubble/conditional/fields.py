from __future__ import unicode_literals


__all__ = ['IntegerField',
           'ChoiceField',
           'MultipleChoiceField',
           'TextField',
           'YesNoField',
           'VocabField',
           'GalleryField',
           'MultiUrlField',
           'MultiPriceField']


class ValidationError(Exception):
    """
    A custom field validation error
    """


class BaseField(object):
    """
    The base field type
    """

    _field_index = 0

    def __init__(self, label, default=None, display_rule=None, required=False,
                 coerce=None, use_widget=None, initial=None):

        self.default = default
        self.label = label
        self.display_rule = display_rule
        self.required = required
        self.use_widget = use_widget
        self.initial = initial

        self._coerce = coerce


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
        self.error = None
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

        key, comp, condition = self.display_rule

        value = self._processed_data.get(key, None)

        if value is None:
            return False

        if comp == "eq":
            return condition == value

        elif comp == "in":
            if isinstance(value, list):
                return any(val for val in value if val in condition)
            else:
                return value in condition

    @property
    def is_valid(self):
        return not self.error

    def validate(self):

        field_data = self._form_data.get(self._key, "")

        if field_data and callable(self._coerce):
            try:
                field_data = self._coerce(field_data)
            except Exception as ex:
                raise ValidationError("Could not coerce data: {}".format(unicode(ex)))

        if self.required:
            #import pdb; pdb.set_trace()
            if field_data in [None, ""]:
                raise ValidationError("This field is required")

        return field_data


class IntegerField(BaseField):

    def __init__(self, *args, **kwargs):

        if "use_widget" not in kwargs:
            kwargs['use_widget'] = "short_text"

        super(IntegerField, self).__init__(*args, **kwargs)

    def validate(self):
        field = super(IntegerField, self).validate()

        try:
            int(field)
        except ValueError:
            raise ValidationError("Field must be an integer value, e.g. 123")

        return field


class ChoiceField(BaseField):
    def __init__(self, *args, **kwargs):

        self._choices = kwargs.pop('choices')

        if "use_widget" not in kwargs:
            kwargs['use_widget'] = "radio"

        super(ChoiceField, self).__init__(*args, **kwargs)

    def validate(self):

        field = super(ChoiceField, self).validate()

        if field and field not in map(lambda x: x[0], self._choices):
            raise ValidationError('Invalid input: {}'.format(field))

        return field


class MultipleChoiceField(BaseField):
    def __init__(self, *args, **kwargs):

        self._choices = kwargs.pop('choices')

        if "use_widget" not in kwargs:
            kwargs['use_widget'] = "checkbox"

        super(MultipleChoiceField, self).__init__(*args, **kwargs)

    def validate(self):

        field = super(MultipleChoiceField, self).validate()

        keys = map(lambda x: x[0], self._choices)
        if any(fld for fld in field if fld not in keys):
            raise ValidationError('Invalid input: {}'.format(field))

        return field


class TextField(BaseField):
    def __init__(self, *args, **kwargs):
        self._max_chars = kwargs.pop('max_chars', 255)

        if "use_widget" not in kwargs:
            kwargs['use_widget'] = "text"

        super(TextField, self).__init__(*args, **kwargs)


class YesNoField(ChoiceField):
    def __init__(self, *args, **kwargs):

        kwargs.pop('choices', None)
        kwargs.pop('coerce', None)

        choices = ((True, 'Yes'), (False, 'No'))

        if "use_widget" not in kwargs:
            kwargs['use_widget'] = "radio"

        super(YesNoField, self).__init__(*args, choices=choices, coerce=lambda x: x == "True", **kwargs)


class BaseMultiItemField(BaseField):
    def __init__(self, *args, **kwargs):
        self.max_items = kwargs.pop('max_items', None)
        self.min_items = kwargs.pop('min_items', 1)

        initial = kwargs.pop('initial', None)

        if initial is None:
            initial = ["" for _ in range(self.min_items)]

        super(BaseMultiItemField, self).__init__(*args, initial=initial, **kwargs)


class VocabField(BaseMultiItemField):
    pass


class GalleryField(BaseMultiItemField):
    pass


class MultiUrlField(BaseMultiItemField):
    def __init__(self, *args, **kwargs):

        super(MultiUrlField, self).__init__(*args, **kwargs)

    def validate(self):
        field_data = super(MultiUrlField, self).validate()

        if not field_data:
            field_data = self.initial

        item_count = sum(1 for item in field_data if item)

        if item_count < self.min_items:
            raise ValidationError(
                "At least {} items required".format(self.min_items))

        if self.max_items is not None and item_count > self.max_items:
            raise ValidationError(
                "No more than {} items allowed".format(self.max_items))

        return field_data


class MultiPriceField(BaseMultiItemField):
    pass


class SupplierField(BaseMultiItemField):
    pass