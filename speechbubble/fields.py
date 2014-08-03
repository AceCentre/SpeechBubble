from collections import OrderedDict



class BaseField(object):
    """
    The base field type
    """

    def __init__(self, label=None, visible_conditions=None, key=None, document=None):
        self._label = label
        self._visible_conditions = visible_conditions
        self._key = key
        self.document = document

    @property
    def has_value(self):
        return self._key in self.document

    @property
    def is_visible(self):
        """
        Should this field be visible?
        """

        for key, value in self._visible_conditions.iteritems():
            if key in self.document and self.document[key] != value:
                return False

        return True

    def validate(self, document):
        raise NotImplementedError

    def render_template(self, edit=False):
        """
        Display a edit control/form element
        """
        raise NotImplementedError


class SelectField(BaseField):
    pass


class MultiSelectField(BaseField):
    pass


class LargeTextField(BaseField):
    pass


class TextField(BaseField):
    pass


class YesNoField(BaseField):
    def __init__(self, **kwargs):
        super(BooleanField, self).__init__(self, **kwargs)

    def render_edtiable_form(self):
        ctx = {
            'key': self._key,
            'label': self._label,
        }
        return """
        <div id="field_{key}">
            <span class="error" id="field_error_{key}"></span>
            <label for="{key}">{label}</label>
            <input type="radio" id="{key}" name="{key}" value="True"> Yes
            <input type="radio" id="{key}" name="{key}" value="False"> No
        </div>
        """.format()


class ProductBase(object):
    pass



class Product(ProductBase):
    def __init__(self):
        self._fields = OrderedDict(
            ('test_1', BooleanField()),
            ('test_2', BooleanField()),
        )

    def validate(self):
        pass

    def render_editable:



