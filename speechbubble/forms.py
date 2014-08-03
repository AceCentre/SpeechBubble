from flask_wtf import Form
from wtforms import StringField, RadioField, validators


TYPE_HARDWARE = 1
TYPE_APP = 2
TYPE_VOCABULARY = 3

TYPE_CHOICES = ((TYPE_HARDWARE, 'Hardware'),
                (TYPE_APP, 'App'),
                (TYPE_VOCABULARY, 'Vocabulary'))


class CreateForm(Form):
    name = StringField(u"Enter a name", [validators.required()])
    type = RadioField(u"Choose a type", choices=TYPE_CHOICES, coerce=int)

