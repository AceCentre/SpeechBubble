from flask_wtf import Form

from wtforms import (validators,
                     StringField,
                     TextField,
                     PasswordField,
                     BooleanField,
                     SelectMultipleField,
                     RadioField,
                     SelectField)

from flask_security.forms import RegisterForm

from .auth import Role, User

from .field_choices import PRODUCT_TYPE_CHOICES


REGISTRATION_TYPE_CHOICES = (
    ("professional", "Professional"),
    ("parent", "Parent"),
    ("aac_user", "AAC User"))

REGISTRATION_REGIONS = (
    ("uk", "UK"),
    ("Europe", "Europe"),
    ("USA", "USA"),
    ("Australia", "Australia"),
    ("Other", "Other"))


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


class SpeechBubbleRegisterForm(RegisterForm):
    first_name = TextField('First Name', [validators.Required()])
    last_name = TextField('Last Name', [validators.Required()])
    registration_type = SelectField('Type', choices=REGISTRATION_TYPE_CHOICES)
    region = SelectField("Region", choices=REGISTRATION_REGIONS)

    # applicable to UK only (these fields will be hidden with some javascript, when n/a)
    city = TextField('Which City or Town?')

    mailing_list = BooleanField('Would you like to be on our mailing list?', default=False)