from __future__ import unicode_literals
from collections import OrderedDict

from .fields import YesNoField, ChoiceField, MultipleChoiceField, IntegerField, BaseField, TextField
from .custom_fields import VocabField

from .field_choices import *


class DeclarativeFieldsMetaclass(type):
    def __new__(cls, name, bases, attrs):
        fields = [(field_name, attrs[field_name]) for field_name, obj in list(attrs.iteritems()) if isinstance(obj, BaseField)]

        sorted(fields, key=lambda field: field[1]._field_index)

        attrs['_fields'] = OrderedDict(fields)

        for key, field in fields:
            field._key = key

        new_class = super(DeclarativeFieldsMetaclass,
                     cls).__new__(cls, name, bases, attrs)

        return new_class


class BranchedForm(object):
    __metaclass__ = DeclarativeFieldsMetaclass

    def __init__(self):
        self.angular_model_name = "data"
        self.errors = []

    def __iter__(self):
        for _, field in self._fields.iteritems():
            yield field

    @property
    def is_valid(self):
        for field in self:
            pass


class InitialSelectionForm(BranchedForm):
    name = TextField("Enter a name", required=True)
    product_type = ChoiceField("What are you adding?", choices=PRODUCT_TYPE_CHOICES)
    hardware_type = ChoiceField(
        "Which hardware type?",
        display_rule=["product_type", "eq", PRODUCT_TYPE_HARDWARE],
        choices=PRODUCT_HARDWARE_SUBTYPE_CHOICES)


class HardwareLowtechForm(BranchedForm):
    message_levels = YesNoField("Message levels?")
    message_number_per_levels = IntegerField("Message number per level", display_rule=["message_levels", "eq", True])
    premade_vocabs_available = YesNoField("Any pre-made vocabularies available?")
    vocabularies = VocabField("List all vocabularies available in system or OTHER:", display_rule=["premade_vocabs_available", "eq", True])
    speech_type_options = ChoiceField("Speech type options?", choices=SPEECH_TYPE_CHOICES)


class HardwareSimpleForm(BranchedForm):
    pass


class HardwareAdvancedForm(BranchedForm):
    pass


class SoftwareForm(BranchedForm):
    pass


class VocabularyForm(BranchedForm):
    """
    The vocabulary form
    """

    vocab_presentation = ChoiceField("How is the vocab primarily presented?", choices=VOCAB_PRESENTATION_CHOICES)
    text_presented = ChoiceField("How is the text primarily presented?", choices=VOCAB_TEXT_PRESENTED_CHOICES, display_rule=["vocab_presentation", "eq", VOCAB_PRESENTATION_TEXT])

    # if text_presented eq VOCAB_TEXT_PRESENTED_KEYBOARD:

    supports_abbr_expansion = YesNoField(
        "Does the vocabulary system allow for abbreviation expansion (e.g. omy expands to: \"On my way!\"",
        display_rule=["text_presented", "eq", VOCAB_TEXT_PRESENTED_KEYBOARD])

    supports_word_prediction = YesNoField(
        "Does the vocabulary system allow for word prediction?",
        display_rule=["text_presented", "eq", VOCAB_TEXT_PRESENTED_KEYBOARD])

    # if text_presented eq VOCAB_TEXT_PRESENTED_SINGLEWORDS:

    words_linked = YesNoField(
        "Does the vocabulary present words that are linked to other related words on; selecting? (e.g. I press \"go to\" the vocabulary presents places)",
        display_rule=["text_presented", "eq", VOCAB_TEXT_PRESENTED_SINGLEWORDS])

    words_start_page_org = MultipleChoiceField(
        "How are words on the start page largely organised?",
        choices=VOCAB_WORD_START_PAGE_CHOICES,
        display_rule=["text_presented", "eq", VOCAB_TEXT_PRESENTED_SINGLEWORDS])

    words_org_other = MultipleChoiceField(
        "How are words organised across the rest of the device?",
        choices=VOCAB_WORD_OTHER_CHOICES,
        display_rule=["text_presented", "eq", VOCAB_TEXT_PRESENTED_SINGLEWORDS])

    # if text_presented eq VOCAB_TEXT_PRESENTED_PHRASES:

    phrases_linked = YesNoField(
        "x Does the vocabulary present words that are linked to other related words on; selecting? (e.g. I press \"go to\" the vocabulary presents places)",
        display_rule=["text_presented", "eq", VOCAB_TEXT_PRESENTED_PHRASES])

    phrases_start_page_org = MultipleChoiceField(
        "x How are words on the start page largely organised?",
        choices=VOCAB_PHRASE_START_PAGE_CHOICES,
        display_rule=["text_presented", "eq", VOCAB_TEXT_PRESENTED_PHRASES])

    phrases_org_other = MultipleChoiceField(
        "x How are words organised across the rest of the device?",
        choices=VOCAB_PHRASE_OTHER_CHOICES,
        display_rule=["text_presented", "eq", VOCAB_TEXT_PRESENTED_PHRASES])


    access_method = MultipleChoiceField(
        "What access method is this designed for? (multiple allowed)",
        choices = ACCESS_METHOD_CHOICES)

    # access_method eq ACCESS_METHOD_TOUCH

    keyboards_available = YesNoField(
        "Are specially designed keyguards available?",
        display_rule=["access_method", "eq", ACCESS_METHOD_TOUCH]
    )

    has_min_target_size = YesNoField(
        "Is there a minimum target size?",
        display_rule=["access_method", "in", [ACCESS_METHOD_TOUCH, ACCESS_METHOD_MOUSE, ACCESS_METHOD_EYEGAZE]]
    )

    min_target_size = IntegerField(
        "What is this size? (mm)",
        display_rule=["has_min_target_size", "eq", YES_CHOICE]
    )

    has_max_locations_per_page = ChoiceField(
        "What is the maximum number of locations per page?",
        display_rule=["has_min_target_size", "eq", YES_CHOICE],
        choices=NA_OR_YES_CHOICES)

    max_locations_per_page = IntegerField(
        "", # no label required as it'll appear alongside the Yes choice of the above question
        display_rule=["has_max_locations_per_page", "eq", YES_CHOICE]
    )

    # access_method eq ACCESS_METHOD_SWITCH

    scanning_options = MultipleChoiceField(
        "What scanning options are available (without additional software)",
        choices=SWITCH_SCANNING_CHOICES,
        display_rule=["access_method", "eq", ACCESS_METHOD_SWITCH]
    )







