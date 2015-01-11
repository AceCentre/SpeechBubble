import mongoengine

from flask import abort, request, flash
from flask.ext import restful
from flask.ext.security.core import current_user, current_app

from .extensions import security, api
from .models import Product, ModerationQueue, ModerationError, User
from .forms import CreateProductForm


def _get_product_by_id(item_id):
    try:
        product = Product.objects.get_or_404(id=item_id)
    except mongoengine.errors.ValidationError:
        abort(400)

    return product


def get_user_by_id(user_id):

        datastore = current_app.extensions['security'].datastore

        user = datastore.get_user(user_id)

        if not user:
            abort(400)

        return user


def _require_owner_or_moderator(draft):
    if draft.owner.id != current_user.id and not current_user.can_moderate:
        abort(403)


class ProductController(restful.Resource):

    def post(self, item_id, user_id):
        """
        Make a new draft, or return an existing draft for this user
        """

        product = _get_product_by_id(item_id)

        user = get_user_by_id(user_id)

        draft = product.get_or_create_draft(user)

        return {'success': False,
                'stats': draft.get_stats(),
                'data': draft.data}

    def get(self, item_id, user_id):
        """
        Get a product
        """

        product = _get_product_by_id(item_id)

        user = get_user_by_id(user_id)

        try:
            draft = product.get_draft(user)
        except IndexError:
            return {'success': False}

        _require_owner_or_moderator(draft)

        form = product.get_form()(draft.data)

        moderation = ModerationQueue.objects(product=product, version_owner=user).first()

        moderation_id = unicode(moderation.id) if moderation else None

        return {'data': form.data,
                'stats': draft.get_stats(),
                'success': True,
                'moderation': moderation_id}

    def put(self, item_id, user_id):
        """
        Update a product
        """

        data = request.get_json()

        product = _get_product_by_id(item_id)

        user = get_user_by_id(user_id)

        try:
            draft = product.get_draft(user)
        except IndexError:
            flash('Draft does not exist')
            return {'success': False}

        _require_owner_or_moderator(draft)

        form = product.get_form()()
        form.process(data, ignore_validation=True)

        # save it anyway
        #if form.errors:
        #    return {'errors': form.errors}

        draft.data = data

        product.save()

        return {'success': True,
                'stats': draft.get_stats()}

    def delete(self, item_id, user_id):

        product = _get_product_by_id(item_id)
        user = get_user_by_id(user_id)

        try:
            draft = product.get_draft(user)
        except IndexError:
            flash("This draft no longer exists - it was either deleted, or published", "error")

        _require_owner_or_moderator(draft)

        if current_user.id != draft.owner.id and not current_user.can_moderate:
            abort(403)
        else:
            product.delete_draft(user)
            ModerationQueue.find()
            flash("Draft deleted.", "success")

        return dict(success=True)


class ProductCreateController(restful.Resource):

    def post(self):
        """
        Create a new product and put initial data into draft
        """

        if not current_user.is_authenticated():
            abort(403)

        data = request.get_json()

        form = CreateProductForm(data)

        if form.errors:
            return {'errors': form.errors}

        product = Product.create_new(form.data['name'],
                                     form.data['product_type'],
                                     form.data.get('hardware_type', None),
                                     current_user)

        return {'id': unicode(product.id)}


class ModerationCreateController(restful.Resource):

    def post(self, item_id, user_id):
        """
        Create a moderation request

        This is an action initiated by the document owner/author when they click
        the 'finalise' button.  If the form is valid, a moderation job will
        be added to the moderation queue.
        """

        data = request.get_json()

        product = _get_product_by_id(item_id)

        user = get_user_by_id(user_id)

        form = product.get_form()(data)

        draft = product.get_draft(user)

        if form.errors:
            return {'errors': form.errors}

        # check for open moderation requests
        try:
            moderation = ModerationQueue.create_moderation_request(product, draft)
        except ModerationError:
            return {'failed': 'This product entry is already in our moderation queue - we will notify you by email when it is reviewed.'}

        moderation.send_moderators_email()

class ModerationController(restful.Resource):

    def put(self, moderation_id, action):

        if action not in ['accept', 'reject', 'delete']:
            abort(400)

        moderation = ModerationQueue.objects.get(id=moderation_id)
        user = User.objects.get(id=moderation.version_owner.id)

        product, draft = moderation.get_product_and_draft()

        response = {'success': True}

        if action == "accept":
            product.history.append(product.published)
            product.published = draft
            product.drafts.remove(draft)
            product.save()

            #email = render_template('emails/accepted.txt', name=user.get_full_name())

        elif action == "rejected":

            product.drafts.remove(draft)
            product.save()

            #email = render_template('emails/rejected.txt')

        elif action == "delete":
            pass

        # remove the moderation entry
        moderation.delete()

        return response


class ModerationUrlController(restful.Resource):

    def post(self, item_id):
        """
        TODO: Check for clashing urls (add functional to product model)
        TODO: Return the new url and in js store this in the url field
        TODO: Check that the current_user can moderate
        """

        data = request.get_json()

        try:
            url = data['url']
        except KeyError:
            abort(400)

        try:
            product = Product.objects.get(id=item_id)
        except Product.DoesNotExist:
            abort(400)

        # is the url unique?

        product.url = url
        product.save()

        response = {'success': True}

        return response


class ImageUploadController(restful.Resource):

    def post(self):
        pass


api.add_resource(ModerationController, '/api/moderation/<string:moderation_id>/<string:action>')
api.add_resource(ModerationCreateController, '/api/moderation/create/<string:item_id>/<string:user_id>')
api.add_resource(ModerationUrlController, '/api/moderation/url/<string:item_id>')

api.add_resource(ProductController, '/api/product/<string:item_id>/<string:user_id>')
api.add_resource(ProductCreateController, '/api/product/create')
api.add_resource(ImageUploadController, '/api/productimage/<string:item_id>')