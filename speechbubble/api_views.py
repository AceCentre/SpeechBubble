import mongoengine
import json

from flask import abort, request
from flask.ext import restful
from flask.ext.security.core import current_user

from .extensions import api
from .models import Product
from .branched_forms import InitialSelectionForm, VocabularyForm, SoftwareForm


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
        #return {'videos': [[], []]}
        return product.draft.data

    def put(self, item_id):
        """
        Update a product
        """

        data = request.get_json()

        product = self._get_product_by_id(item_id)

        if product.type == "vocab":
            form = VocabularyForm(data)
        elif product.type == "app":
            form = SoftwareForm(data)

        if form.errors:
            return {'errors': form.errors}

        product.draft.data = data
        product.save()

        return {'status': "OK"}


class ProductCreateController(restful.Resource):

    def post(self):
        """
        Create a new product and put initial data into draft
        """

        data = request.get_json()

        if not data:
            abort(400)

        form = InitialSelectionForm(data)

        if form.errors:
            return {'errors': form.errors}

        product = Product.create_new(form.data['name'],
                                     form.data['product_type'],
                                     form.data.get('product_sub_type', None),
                                     current_user)

        return {'id': unicode(product.id)}

class ImageUploadController(restful.Resource):

    def post(self):
        pass


api.add_resource(ProductController, '/api/product/<string:item_id>')
api.add_resource(ProductCreateController, '/api/product/create')
api.add_resource(ImageUploadController, '/api/productimage/<string:item_id>')