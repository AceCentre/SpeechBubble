from flask import render_template, redirect, url_for, abort, flash, request, current_app
from flask.ext.security import login_required, roles_required, current_user

from .app import app, db

from .forms import UserForm
from .models import Product, User, Role, ModerationQueue

from .forms import InitialSelectionForm, VocabularyForm, SoftwareForm


@app.route('/create', methods=['GET', 'POST'])
@login_required
def create_product():
    form = InitialSelectionForm()

    return render_template('edit/create.html', form=form)


@app.route('/edit/<object_id>/<user_id>', methods=['GET', 'POST'], endpoint="edit-product")
@app.route('/edit/<object_id>')
@login_required
def edit_product(object_id, user_id=None):

    datastore = current_app.extensions['security'].datastore

    if not user_id:
        user = current_user
    else:
        user = datastore.get_user(user_id)

    if not user:
        abort(400)

    product = Product.objects.get(id=object_id)

    awaiting_moderation = ModerationQueue.has_entry(product, user)

    templates = dict(
        vocabulary="vocabulary.html",
        app="software.html",
        hardware="hardware.html")

    if not product:
        abort(404)

    template = templates[product.type]

    #draft = product.get_draft(user)

    form = product.get_form() #(draft.data)

    return render_template("edit/"+template, form=form,
                           itemId=unicode(product.id), product=product,
                           userId=user.id,  awaiting_moderation=awaiting_moderation)


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
def edit_user(object_id=None, user_id=None):

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
    return render_template('admin/moderation.html', objects=ModerationQueue.objects())


@app.route('/products')
@login_required
def list_all_products():
    """
    A temporary view showing all products in the system
    """

    return render_template("admin/products.html", products=Product.objects)


@app.route('/my-account')
@login_required
def my_account():

    return "hello"


@app.route('/create-draft/<object_id>')
@login_required
def create_draft(object_id):
    """
    Create a new draft or return an existing draft for a given user
    """

    product = Product.objects.get(id=object_id)

    product.get_or_create_draft(current_user)

    return redirect(url_for("edit-product", object_id=product.id, user_id=current_user.id))


@app.route('/suppliers')
def suppliers():

    return render_template("edit/suppliers.html")
