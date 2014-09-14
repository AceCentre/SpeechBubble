from speechbubble.branched_forms import BranchedForm
from speechbubble.fields import TextField

from .utils import SBBaseTestCase


class BranchedFormTestCase(SBBaseTestCase):

    def test_text_field_validation_required_invalid_data(self):

        class TestForm(BranchedForm):
            test = TextField("a test field", required=True)

        form = TestForm()

        form.process({})

        self.assertFalse(form.is_valid)
        self.assertEquals(form.errors.keys()[0], "test")

    def test_text_field_validation_required_valid_data(self):

        class TestForm(BranchedForm):
            test = TextField("a test field", required=True)

        form = TestForm()

        form.process({'test': 'not empty'})

        self.assertTrue(form.is_valid)
        self.assertEquals(form.errors, {})
        self.assertEquals(form.data['test'], "not empty")

    def test_branched_field_dependent_field_required_but_not_visible(self):
        """
        If a dependent field has validation requirements, e.g. it's set to 'required', but
        it isn't actually visible due to a display rule, then those validation rules should
        be ignored.
        """

        class TestForm(BranchedForm):
            test = TextField("a test field")
            test2 = TextField("a test dependent field", required=True, display_rule=["test", "eq", "showme"])

        form = TestForm()

        form.process({'test': "notshowingyou", "test2": ""})

        self.assertTrue(form.is_valid)
        self.assertEquals(form.errors, {})

    def test_branched_field_dependent_field_required_and_visible(self):
        """
        The second field is visible and it's required, therefore if not supplied we should
        see a validation error on that field.
        """

        class TestForm(BranchedForm):
            test = TextField("a test field")
            test2 = TextField("a test dependent field", required=True, display_rule=["test", "eq", "showme"])

        form = TestForm()

        form.process({'test': "showme", "test2": ""})

        self.assertFalse(form.is_valid)
        self.assertIn("test2", form.errors)

    def test_branched_data_supplied_for_non_visible_field(self):
        """
        A sanity check - if a field is not visible, but data is supplied, then
        that data should not find its way into forms.data
        """

        class TestForm(BranchedForm):
            test = TextField("a test field")
            test2 = TextField("a test dependent field", required=True, display_rule=["test", "eq", "showme"])

        form = TestForm()

        #form.process({'test': })

