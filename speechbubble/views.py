from flask import render_template, redirect, url_for, abort
from flask.ext.security import login_required, roles_required, current_user

from wtforms import (Form,
                     Field,
                     validators,
                     widgets,
                     TextAreaField,
                     RadioField,
                     BooleanField,
                     TextField,
                     SelectMultipleField,
                     SelectField)

from . import app, db
from .auth import User

from .forms import CreateForm
from .models import Product


class SBCheckboxInput(widgets.CheckboxInput):
    pass


class SBFieldMixin(Field):
    def __init__(self, *args, **kwargs):
        self.show_rule = kwargs.pop('show_rule', None)

        super(SBFieldMixin, self).__init__(*args, **kwargs)


class SBTextField(TextField, SBFieldMixin):
    pass


class SBTextAreaField(TextAreaField, SBFieldMixin):
    pass


class SBBooleanField(BooleanField, SBFieldMixin):
    pass


class SBRadioField(RadioField, SBFieldMixin):
    pass


class SBSelectField(SelectField, SBFieldMixin):
    pass


class SBSelectMultipleField(SBFieldMixin, SelectMultipleField):

    def __init__(self, label=None, validators=None, **kwargs):

        super(SBSelectMultipleField, self).__init__(label,
                                                    validators,
                                                    option_widget=SBCheckboxInput(),
                                                    widget=widgets.ListWidget(prefix_label=False),
                                                    **kwargs)


FIELD_AVAILABILITY_AVAILABLE = 1
FIELD_AVAILABILITY_DISCONTINUED = 0
FIELD_AVAILABILITY_CHOICES = (
    (FIELD_AVAILABILITY_AVAILABLE, "Available"),
    (FIELD_AVAILABILITY_DISCONTINUED, "Discontinued")
)

FIELD_SYMBOL_SYSTEM_CHOICES = (
    ('option1', 'Option 1'),
    ('option2', 'Option 2'),
    ('option3', 'Option 3')
)

FIELD_CURRENCY_CHOICES = (
    ('GBP', 'GBP'),
    ('AUD', 'AUD'),
    ('USD', 'USD')
)

FIELD_SUPPLIER_CHOICES = (
    ('option1', 'Option 1'),
    ('option2', 'Option 2'),
    ('option3', 'Option 3')
)

FIELD_ENVIROMENTAL_CONTROL_CAPABILITES = (
    ('option1', 'Option 1'),
    ('option2', 'Option 2'),
    ('option3', 'Option 3')
)

FIELD_OPTION_YES = 1
FIELD_OPTION_NO = 0

FIELD_YES_NO_CHOICES = (
    (FIELD_OPTION_YES, "Yes"),
    (FIELD_OPTION_NO, "No"),
)

FIELD_GENERIC_CHOICES = (
    ('option1', 'Option 1'),
    ('option2', 'Option 2'),
    ('option3', 'Option 3')
)


class VocabularyForm(Form):
    available = SBRadioField('Product Available?', choices=FIELD_AVAILABILITY_CHOICES)
    symbol_systems_supported = SBSelectMultipleField("What symbol systems are supported?",
                                                     choices=FIELD_SYMBOL_SYSTEM_CHOICES)
    currency = SBSelectField('Price', choices=FIELD_CURRENCY_CHOICES)
    price = SBTextField('', [validators.Length(min=6, max=35)])
    associated_costs = SBTextAreaField('Associated costs?')
    supplier = SBSelectField('Supplier', choices=FIELD_SUPPLIER_CHOICES)
    support_multiple_users = SBRadioField('Support multiple users?', choices=FIELD_YES_NO_CHOICES)
    description = SBTextAreaField('Description')
    operating_system_min_requirements = SBSelectMultipleField(choices=FIELD_GENERIC_CHOICES)
    operating_system_max_requirements = SBSelectMultipleField(choices=FIELD_GENERIC_CHOICES)
    enviromental_control_capabilities = SBSelectMultipleField(choices=FIELD_ENVIROMENTAL_CONTROL_CAPABILITES)
    dedicated_device_only = SBRadioField("Works on a dedicated device only?", choices=FIELD_YES_NO_CHOICES)
    devices_multiselect = SBSelectMultipleField("Devices", choices=FIELD_GENERIC_CHOICES, show_rule="data['dedicated_device_only']==1")
    devices_singleselect = SBRadioField("Devices", choices=FIELD_GENERIC_CHOICES, show_rule="data['dedicated_device_only']==0")

@app.route('/create', methods=['GET', 'POST'])
@login_required
def create_product():
    form = CreateForm()

    if form.validate_on_submit():
        product = Product.create_new(form.data['name'], form.data['type'], current_user)

        return redirect(url_for('edit', object_id=product.id))

    return render_template('create.html', form=form)


@app.route('/edit/<object_id>')
@login_required
def edit(object_id):
    product = Product.objects.get(id=object_id)

    form = VocabularyForm()

    return render_template('edit.html', product=product, form=form)


@app.route('/')
def home():
    return render_template('index.html', products=Product.objects)


@app.route('/admin/users')
@login_required
def list_users():
    return render_template('list_users.html', users=User.objects)


@app.route('/user/edit')
def edit_user():
    return render_template('list_users.html')


@roles_required(['Admin', 'Moderator'])
@app.route('/moderation')
def moderation_queue():
    return render_template('moderation.html')


@app.route('/catalog')
def show_item():
    return render_template('display-item.html')


@app.route('/test-hardware')
@login_required
def test_hardware():
    form = VocabularyForm()

    return render_template('test-hardware.html', form=form)
