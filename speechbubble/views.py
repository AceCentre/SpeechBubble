from flask import render_template, redirect, url_for, abort, flash, request, current_app
from flask.ext.security import login_required, roles_required, current_user

from .app import app, db

from .api_views import get_user_by_id

from .forms import UserForm
from .models import Product, User, Role, ModerationQueue

from .forms import CreateProductForm, VocabularyForm, SoftwareForm


@app.route('/create', methods=['GET', 'POST'])
@login_required
def create_product():
    form = CreateProductForm()

    return render_template('edit/create.html', form=form)


@app.route('/moderation/<object_id>/<user_id>', defaults={'mode': 'moderation'}, methods=['GET', 'POST'],
           endpoint="moderate-product-view")
@login_required
def view_draft(object_id, user_id, mode):

    # should be able to switch the view with defaults on each url type, e.g.
    # view/view.html
    # moderation/view.html
    # edit/view.html etc. as needed

    product = Product.objects.get_or_404(id=object_id)
    user = get_user_by_id(user_id)

    draft = product.get_draft(user)

    template_name = "{}/view.html".format(mode)

    form = product.get_form()(draft.data)

    return render_template(template_name, form=form, product=product,
                           object_id=product.id, owner_id=user.id, mode="view")


@app.route('/moderate/edit/<object_id>/<user_id>', defaults={'mode': 'moderation'}, methods=['GET', 'POST'], endpoint="moderate-product-edit")
@app.route('/edit/<object_id>/<user_id>', defaults={'mode': 'edit'}, methods=['GET', 'POST'], endpoint="edit-product")
@login_required
def edit_product(object_id, user_id=None, mode=None):
    """
    Supporting editing in normal edit mode and moderation edit mode
    """

    datastore = current_app.extensions['security'].datastore

    if not user_id:
        user = current_user
    else:
        user = datastore.get_user(user_id)

    if not user:
        abort(400)

    product = Product.objects.get_or_404(id=object_id)

    awaiting_moderation = ModerationQueue.has_entry(product, user)

    templates = dict(
        vocabulary="vocabulary.html",
        app="software.html",
        hardware="hardware.html")

    template_name = "{}/{}".format(mode, templates[product.type])

    draft = product.get_draft(user)

    form = product.get_form()(draft.data)

    return render_template(template_name, form=form,
                           object_id=unicode(product.id), product=product,
                           owner_id=user.id,  awaiting_moderation=awaiting_moderation)


@app.route('/view/<string:object_id>')
def view_product(object_id):

    product = Product.objects.get_or_404(id=object_id)

    form = product.get_form()(product.published.data)

    return render_template("view/view.html", form=form,
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
    return render_template('moderation/queue.html', objects=ModerationQueue.objects())


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


"""@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def product_view(path):
    import pdb; pdb.set_trace()

    # this is the catch all router - that will match the url with entries in the product collections
    return 'You want path: %s' % path"""
