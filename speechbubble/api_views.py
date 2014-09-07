import mongoengine
import json

from flask import abort, request
from flask.ext import restful

from .extensions import api
from .models import Product
from .branched_forms import InitialSelectionForm, VocabularyForm


class ProductController(restful.Resource):
    def _get_product_by_id(self, item_id):
        try:
            product = Product.objects.get(id=item_id)
        except mongoengine.errors.ValidationError:
            abort(400)

        if not product:
            abort(404, "No product with ID {}".format(item_id))

        return product

    def get(self, item_id):
        """
        Get a product
        """

        product = self._get_product_by_id(item_id)

        return product.draft.data

    def put(self, item_id):
        """
        Update a product
        """

        product = self._get_product_by_id(item_id)


class ProductCreateController(restful.Resource):

    def post(self):
        """
        Create a new product and put initial data into draft
        """
        import pdb; pdb.set_trace()
        data = request.form.get('form_data', None)

        if not data:
            abort(400)

        data = json.loads(data)

        form = InitialSelectionForm(data)

        if form.errors:
            return {'errors': form.errors}

        product = Product.create_new(form.data['name'],
                                     form.data['product_type'],
                                     form.data['product_sub_type'],
                                     current_user)

        return {'id': product.id}


api.add_resource(ProductController, '/api/product/<string:item_id>')
api.add_resource(ProductCreateController, '/api/product/create')