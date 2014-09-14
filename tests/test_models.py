from speechbubble.models import Product
from speechbubble.auth import User

from speechbubble import create_app
import unittest

from .utils import SBBaseMongoTestCase
from .factories import UserFactory

from flask.ext.testing import TestCase


class ProductDraftTestCase(SBBaseMongoTestCase):

    #def create_app(self):

    #    return create_app(testing=True)

    def test_create_product_makes_draft(self):
        user = UserFactory()
        product = Product.create_new(cls, name, product_type, product_sub_type, user)

    """
    def test_cannot_create_duplicate_draft(self):
        pass

    def test_get_draft_

    def test_get_draft_with_no_published

    def
    """

if __name__ == "__main__":
    unittest.main()