from speechbubble.fields import BaseField
from .utils import BaseTestCase


class FieldTestBasicFunctionalityTestCase(BaseTestCase):

    def test_field_visible_with_display_rule_neq_and_visible(self):

        document = {
            'previous_field': 5
        }

        field = BaseField("test field", display_rule=['previous_field', 'neq', 6])

        field.process({}, document)

        self.assertTrue(field.is_visible())

    def test_field_visible_with_display_rule_neq_not_visible(self):

        document = {
            'previous_field': 5
        }

        field = BaseField("test field", display_rule=['previous_field', 'neq', 5])

        field.process({}, document)

        self.assertFalse(field.is_visible())

    def test_field_visible_with_display_rule_eq_and_visible(self):

        document = {
            'previous_field': 5
        }

        field = BaseField("test field", display_rule=['previous_field', 'eq', 5])

        field.process({}, document)

        self.assertTrue(field.is_visible())

    def test_field_visible_with_display_rule_eq_and_not_visible(self):

        document = {
            'previous_field': 5
        }

        field = BaseField("test field", display_rule=['previous_field', 'eq', 6])

        field.process({}, document)

        self.assertFalse(field.is_visible())

    def test_required_if_visible_and_data_valid(self):

        field = BaseField("test field", required=True, display_rule=['previous_field', 'eq', 5])

        field._key = "test_key"
        document = {
            'previous_field': 5,
        }

        form_data = {
            'test_key': 10
        }

        field.process(form_data, document)

        self.assertTrue(field.is_valid)

    def test_required_if_visible_and_data_invalid(self):

        field = BaseField("test field", required=True, display_rule=['previous_field', 'eq', 5])

        field._key = "test_key"

        document = {
            'previous_field': 5
        }

        field.process({}, document)

        self.assertFalse(field.is_valid)


class ChoiceFieldTestCase(BaseTestCase):
    def test_invalid_options_raises_exception(self):
        pass