from flask import render_template, redirect, url_for, abort, flash, request
from flask.ext.security import login_required, roles_required, current_user

from . import app, db
from .auth import User, Role

from .forms import UserForm
from .models import Product

from .branched_forms import InitialSelectionForm, VocabularyForm, SoftwareForm


@app.route('/create', methods=['GET', 'POST'])
@login_required
def create_product():
    form = InitialSelectionForm()

    return render_template('edit/create.html', form=form)

@app.route('/edit/<string:object_id>')
@login_required
def edit_product(object_id):

    product = Product.objects.get(id=object_id)

    templates = dict(
        vocabulary="vocabulary.html",
        app="software.html",
        hardware="hardware.html")

    if not product:
        abort(404)

    template = templates[product.type]

    form = product.get_form()(product.draft.data)

    return render_template("edit/"+template, form=form,
                           itemId=unicode(product.id), product=product)


@app.route('/view/<string:object_id>')
def view_product(object_id):

    product = Product.objects.get(id=object_id)

    if not product:
        abort(404)

    form = product.get_form()(product.published.data)

    return render_template("view/"+template, form=form,
                           itemId=unicode(product.id), product=product)


@app.route('/')
def home():
    return render_template('index.html', product=Product.objects)


@app.route('/admin/users')
@login_required
def list_users():
    return render_template('admin/list_users.html', users=User.objects)


@app.route('/user/edit/<object_id>', methods=['GET', 'POST'])
def edit_user(object_id=None):

    if object_id:
        user = User.objects(id=object_id).first()

        if not user:
            abort(400)
    else:
        user = User()

    form = UserForm(request.form, user)

    if form.validate_on_submit():
        user.populate_from_form(form)

        verb = "updated" if object_id else "created"
        flash("User record {}".format(verb), "info")

        return redirect(url_for("list_users"))

    return render_template('admin/edit_user.html',
                           form=form,
                           adding_user=(object_id is None))


@app.route('/user/add', methods=['GET', 'POST'])
def add_user():
    return edit_user()


@roles_required(['Admin', 'Moderator'])
@app.route('/moderation')
def moderation_queue():
    """
    Display the moderation queue
    """
    return render_template('admin/moderation.html')


@app.route('/vocab')
def test_vocab():
    form = VocabularyForm()
    return render_template('edit/vocabulary_edit.html', form=form)


@app.route('/products')
def list_all_products():
    """
    A temporary view showing all products in the system
    """

    return render_template("admin/products.html", products=Product.objects)