# the individual item specifications

class BaseField(object):
    def __init__(self, id_=None, default=None, label=None, visible=None, validators=None):
        self.id_ = id_
        self.default = default
        self.label = label
        self.visbible = visible
        self.validators = validators

    def set_form_data(self, form_data):
        self._data = form_data

    def get_html_id(self):
        return

    def get_label_html(self):
        return '<label for=""'

    def render_frontend(self):
        raise NotImplementedError

    def render_edit(self):
        raise NotImplemetedError


class TextField(BaseField):
    pass

class LargeTextField(BaseField):
    pass

class CheckBoxField(BaseField):
    pass

class RadioButtonField(BaseField):
    pass

class YesNoField(RadioButtonField):
    pass

class DeclarativeFieldsMetaclass(type):
    def __new__(cls, name, bases, attrs):
        attrs['_fields'] = [(field_name, attrs.pop(field_name)) for field_name, obj in list(attrs.iteritems()) if isinstance(obj, BaseField)]

        new_class = super(DeclarativeFieldsMetaclass,
                     cls).__new__(cls, name, bases, attrs)

        return new_class


class BaseItem(object):
    __metaclass__ = DeclarativeFieldsMetaclass

class Hardware(BaseItem):
    name = TextField()
    is_available = YesNoField()
    description = LargeTextField()

if __name__=="__main__":
    hw = Hardware()
    import pdb; pdb.set_trace()







