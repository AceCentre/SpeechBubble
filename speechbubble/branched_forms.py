from __future__ import unicode_literals
from collections import OrderedDict

from .fields import YesNoField, ChoiceField, MultipleChoiceField, IntegerField, BaseField, TextField

from .field_choices import *
from .custom_fields import *


__all__ = ['InitialSelectionForm', 'VocabularyForm', 'SoftwareForm']


class DeclarativeFieldsMetaclass(type):
    def __new__(cls, name, bases, attrs):
        fields = [(field_name, attrs[field_name]) for field_name, obj
                  in list(attrs.iteritems()) if isinstance(obj, BaseField)]

        fields = sorted(fields, key=lambda field: field[1]._field_index)

        attrs['_fields'] = OrderedDict(fields)

        for key, field in fields:
            field._key = key

        new_class = super(DeclarativeFieldsMetaclass,
                     cls).__new__(cls, name, bases, attrs)

        return new_class


class BranchedForm(object):
    __metaclass__ = DeclarativeFieldsMetaclass

    def __init__(self, form_data=None):
        self.angular_model_name = "form_data"
        self.errors = {}
        self.data = self.initial_data()

        if form_data is not None:
            self.process(form_data)

    def __iter__(self):
        for _, field in self._fields.iteritems():
            yield field

    def initial_data(self):
        """
        Set up initial data for fields that support it
        """
        data = {}

        for field in self:
            initial = field.initial

            if initial is not None:
                data[field._key] = initial

        return data

    def process(self, form_data):
        #self.data = {}

        for field in self:
            if field._key == "videos":
               import pdb; pdb.set_trace()
            field.process(form_data, self.data)

            if field.is_visible():
                if field.is_valid:
                    self.data[field._key] = field.data
                else:
                    self.errors[field._key] = field.error

    @property
    def is_valid(self):
        if self.data is None:
            raise Exception("No form data has been processed")

        return not self.errors


class InitialSelectionForm(BranchedForm):
    name = TextField(
        "Enter a name",
        required=True)

    product_type = ChoiceField(
        "What are you adding?",
        choices=PRODUCT_TYPE_CHOICES,
        required=True)

    hardware_type = ChoiceField(
        "Which hardware type?",
        display_rule=["product_type", "eq", PRODUCT_TYPE_HARDWARE],
        choices=PRODUCT_HARDWARE_SUBTYPE_CHOICES,
        required=True)


class HardwareLowtechForm(BranchedForm):
    message_levels = YesNoField(
        "Message levels?")

    message_number_per_levels = IntegerField(
        "Message number per level",
        display_rule=["message_levels", "eq", True])

    premade_vocabs_available = YesNoField(
        "Any pre-made vocabularies available?")

    vocabularies = VocabField(
        "List all vocabularies available in system or OTHER",
        display_rule=["premade_vocabs_available", "eq", True])

    speech_type_options = ChoiceField(
        "Speech type options?",
        choices=SPEECH_TYPE_CHOICES)


class HardwareSimpleForm(BranchedForm):
    pass


class HardwareAdvancedForm(BranchedForm):
    pass


class VocabularyForm(BranchedForm):
    """
    The vocabulary form
    """

    vocab_presentation = ChoiceField(
        "How is the vocab primarily presented?",
        choices=VOCAB_PRESENTATION_CHOICES,
        required=True)

    text_presented = ChoiceField(
        "How is the text primarily presented?", choices=VOCAB_TEXT_PRESENTED_CHOICES,
        display_rule=["vocab_presentation", "eq", VOCAB_PRESENTATION_TEXT],
        required=True)

    # if text_presented eq VOCAB_TEXT_PRESENTED_KEYBOARD:

    supports_abbr_expansion = YesNoField(
        "Does the vocabulary system allow for abbreviation expansion (e.g. omy expands to: \"On my way!\"",
        display_rule=["text_presented", "eq", VOCAB_TEXT_PRESENTED_KEYBOARD],
        required=True)

    supports_word_prediction = YesNoField(
        "Does the vocabulary system allow for word prediction?",
        display_rule=["text_presented", "eq", VOCAB_TEXT_PRESENTED_KEYBOARD],
        required=True)

    # if text_presented eq VOCAB_TEXT_PRESENTED_SINGLEWORDS:

    words_linked = YesNoField(
        "Does the vocabulary present words that are linked to other related words on; selecting? (e.g. I press \"go to\" the vocabulary presents places)",
        display_rule=["text_presented", "eq", VOCAB_TEXT_PRESENTED_SINGLEWORDS],
        required=True)

    words_start_page_org = MultipleChoiceField(
        "How are words on the start page largely organised?",
        choices=VOCAB_WORD_START_PAGE_CHOICES,
        display_rule=["text_presented", "eq", VOCAB_TEXT_PRESENTED_SINGLEWORDS],
        required=True)

    words_org_other = MultipleChoiceField(
        "How are words organised across the rest of the device?",
        choices=VOCAB_WORD_OTHER_CHOICES,
        display_rule=["text_presented", "eq", VOCAB_TEXT_PRESENTED_SINGLEWORDS],
        required=True)

    # if text_presented eq VOCAB_TEXT_PRESENTED_PHRASES:

    phrases_linked = YesNoField(
        "Does the vocabulary present words that are linked to other related words on; selecting? (e.g. I press \"go to\" the vocabulary presents places)",
        display_rule=["text_presented", "eq", VOCAB_TEXT_PRESENTED_PHRASES],
        required=True)

    phrases_start_page_org = MultipleChoiceField(
        "How are words on the start page largely organised?",
        choices=VOCAB_PHRASE_START_PAGE_CHOICES,
        display_rule=["text_presented", "eq", VOCAB_TEXT_PRESENTED_PHRASES],
        required=True)

    phrases_org_other = MultipleChoiceField(
        "How are words organised across the rest of the device?",
        choices=VOCAB_PHRASE_OTHER_CHOICES,
        display_rule=["text_presented", "eq", VOCAB_TEXT_PRESENTED_PHRASES],
        required=True)

    access_method = MultipleChoiceField(
        "What access method is this designed for? (multiple allowed)",
        choices=ACCESS_METHOD_CHOICES,
        required=True)

    # access_method eq ACCESS_METHOD_TOUCH

    keyboards_available = YesNoField(
        "Are specially designed keyguards available?",
        display_rule=["access_method", "eq", ACCESS_METHOD_TOUCH],
        required=True
    )

    has_min_target_size = YesNoField(
        "Is there a minimum target size?",
        display_rule=["access_method", "in", [ACCESS_METHOD_TOUCH, ACCESS_METHOD_MOUSE, ACCESS_METHOD_EYEGAZE]],
        required=True
    )

    min_target_size = IntegerField(
        "What is this size? (mm)",
        display_rule=["has_min_target_size", "eq", YES_CHOICE],
        required=True
    )

    has_max_locations_per_page = ChoiceField(
        "What is the maximum number of locations per page?",
        display_rule=["has_min_target_size", "eq", YES_CHOICE],
        choices=NA_OR_YES_CHOICES,
        coerce=lambda x: x in ["True", True],
        required=True)

    max_locations_per_page = IntegerField(
        "xxxxxxxxxxxxxxxx",
        display_rule=["has_max_locations_per_page", "eq", YES_CHOICE],
        required=True
    )

    # access_method eq ACCESS_METHOD_SWITCH

    scanning_options = MultipleChoiceField(
        "What scanning options are available (without additional software)",
        choices=SWITCH_SCANNING_CHOICES,
        display_rule=["access_method", "in", ACCESS_METHOD_SWITCH],
        required=True)


class SoftwareForm(BranchedForm):
    discontinued = YesNoField(
        "Discontinued?",
        required=True
    )

    images = GalleryField("Add images", max_items=6)
    videos = MultiUrlField("Add video urls", max_items=2)

    image_representation_supported = MultipleChoiceField(
        "Image representation supported",
        choices=IMAGE_REPRESENTATION_CHOICES,
        required=True)

    symbol_systems_supported = MultipleChoiceField(
        "Symbol systems supported",
        choices=SUPPORT_SYMBOLS_CHOICES,
        display_rule=["image_representation_supported", "eq", IMAGE_REPRESENTATION_SYMBOLS],
        required=True)

    speech_type = MultipleChoiceField(
        "Speech Type",
        choices=SPEECH_TYPE_CHOICES,
        required=True
    )

    synthesised_speech_type_choices = MultipleChoiceField(
        "Synthesized speech type options",
        choices=SYNTHESIZED_SPEECH_TYPE_CHOICES,
        display_rule=["speech_type", "in", [SPEECH_TYPE_SYNTHESISED]],
        required=True
    )

    synthesised_num_voices = IntegerField(
        "No of voices available",
        display_rule=["speech_type", "in", [SPEECH_TYPE_SYNTHESISED]],
        required=True
    )

    price = MultiPriceField(
        "price"
    )

    associated_costs = TextField(
        "Associated Costs"
    )

    # supplier field needs discussing - not quite sure what is

    support_multiple_users = YesNoField(
        "Support multiple users?"
    )

    long_description = TextField(
        "Description"
    )

    enviro_control_capabilities = MultipleChoiceField(
        "Enviro Control capabilities",
        choices=ENVIROMENT_CAPABILITY_CHOICES,
        required=True
    )

    enviro_control_more_details = TextField(
        "More details"
    )

    control_other_computer = YesNoField(
        "Control of another computer/device from software possible?",
        required=True
    )

    control_operating_system = YesNoField(
        "Control of wider operating system possible from software?",
        required=True
    )

    support_url = TextField(
        "Support url",
        required=True
    )

    purchase_urls = MultiUrlField(
        "Purchase Urls",
        min_items=1,
        max_items=3
    )

    more_info_urls = MultiUrlField(
        "More info URLs:",
        max_items=6
    )

    editing_options = TextField(
        "Editing Options",
        max_chars=500
    )

    visual_options = MultipleChoiceField(
        "Visual Options",
        choices=VISUAL_OPTIONS,
        required=True
    )

    visual_options_more_info = TextField(
        "Visual options more info"
    )

    works_on_dedicated_device = YesNoField(
        "Works on a Dedicated device only?",
        required=True
    )

    operating_system_supported_min = ChoiceField(
        "Operating System officially and reliably supported (minimum)",
        choices=SUPPORTED_OPERATING_SYSTEM_CHOICES,
        use_widget="select",
        required=True
    )

    operating_system_supported_max = ChoiceField(
        "Operating System officially and reliably supported (maximum)",
        choices=SUPPORTED_OPERATING_SYSTEM_CHOICES,
        use_widget="select",
        required=True
    )

    has_more_than_one_vocab = YesNoField(
        "Does it have more than one vocabulary installed?",
        required=True)

    access_method = MultipleChoiceField(
        "What access method is this designed for? (multiple allowed)",
        choices=ACCESS_METHOD_CHOICES,
        required=True)

    # access_method eq ACCESS_METHOD_TOUCH

    supports_capacitive_or_resistive_touch = YesNoField(
        "Does the device support capacitive or resistive touch?",
        display_rule=["access_method", "in", ACCESS_METHOD_TOUCH],
        required=True)

    specialist_gestures = YesNoField(
        "Are specialist gestures etc required to control the device?",
        display_rule=["access_method", "in", ACCESS_METHOD_TOUCH],
        required=True)

    supported_touch_features = MultipleChoiceField(
        "What Touch features are available?",
        choices=SUPPORTED_TOUCH_FEATURES,
        required=True
    )

    supported_touch_features_other = TextField(
        "other",
        max_chars=250,
        display_rule=["supported_touch_features", "in", SUPPORTED_TOUCH_OTHER],
        required=True)

    #items below are duplicated from vocabulary
    has_min_target_size = YesNoField(
        "Is there a minimum target size?",
        display_rule=["access_method", "in", [ACCESS_METHOD_TOUCH, ACCESS_METHOD_MOUSE, ACCESS_METHOD_EYEGAZE]],
        required=True
    )

    min_target_size = IntegerField(
        "What is this size? (mm)",
        display_rule=["has_min_target_size", "eq", YES_CHOICE],
        required=True
    )

    has_max_locations_per_page = ChoiceField(
        "What is the maximum number of locations per page?",
        display_rule=["has_min_target_size", "eq", YES_CHOICE],
        choices=NA_OR_YES_CHOICES,
        coerce=lambda x: x == "True" or x,
        required=True)

    max_locations_per_page = IntegerField(
        "xxxxxxxxxxxxxxxx",
        display_rule=["has_max_locations_per_page", "eq", YES_CHOICE],
        required=True
    )

    # access_method eq ACCESS_METHOD_SWITCH

    scanning_options = MultipleChoiceField(
        "What scanning options are available (without additional software)",
        choices=SWITCH_SCANNING_CHOICES,
        display_rule=["access_method", "in", ACCESS_METHOD_SWITCH],
        required=True)