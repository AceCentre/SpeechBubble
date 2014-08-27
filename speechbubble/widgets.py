

class BaseWidget(object):
    pass


class AngularRadioWidget(BaseWidget):
    """
    An angular widget for choices
    """
    def render(self, field, angular_model_field="data"):

        for choice in field.choices:


