from flask_wtf import Form
from wtforms import (validators,
                     StringField,
                     PasswordField,
                     BooleanField,
                     SelectMultipleField,
                     RadioField)

from .auth import Role, User

from .field_choices import PRODUCT_TYPE_CHOICES


class CreateForm(Form):
    name = StringField(u"Enter a name", [validators.required()])
    type = RadioField(u"Choose a type", choices=PRODUCT_TYPE_CHOICES, coerce=int)


class UserForm(Form):
    """
    User admin form
    """
    email = StringField(validators=[validators.Email()])
    password = PasswordField()
    active = BooleanField()

    roles = SelectMultipleField(coerce=str)

    def __init__(self, *args, **kwargs):

        super(UserForm, self).__init__(*args, **kwargs)

        self.roles.choices = [(str(role.id), role.name) for role in Role.objects]

        # convert list of Role() elements into a list of Role ids
        # for the select control
        if len(args) > 1 and not args[0] and isinstance(args[1], User):
            self.roles.process_data(str(role.id) for role in args[1].roles)

