from flask_wtf import Form

from wtforms import (validators,
                     StringField,
                     TextField as WTextField,
                     PasswordField,
                     BooleanField,
                     SelectMultipleField,
                     RadioField,
                     SelectField)

from .conditional.fields import (YesNoField,
                                 ChoiceField,
                                 MultipleChoiceField,
                                 IntegerField,
                                 TextField,
                                 VocabField,
                                 GalleryField,
                                 MultiUrlField,
                                 MultiPriceField)

from .conditional.forms import ConditionalForm

from flask_security.forms import RegisterForm

from .field_choices import *


class UserForm(Form):
    """
    User admin form
    """
    email = StringField(validators=[validators.Email()])
    password = PasswordField()
    active = BooleanField()

    roles = SelectMultipleField(coerce=str)

    def __init__(self, *args, **kwargs):

        from .models import Role, User

        super(UserForm, self).__init__(*args, **kwargs)

        self.roles.choices = [(str(role.id), role.name) for role in Role.objects]

        # convert list of Role() elements into a list of Role ids
        # for the select control
        if len(args) > 1 and not args[0] and isinstance(args[1], User):
            self.roles.process_data(str(role.id) for role in args[1].roles)


class SpeechBubbleRegisterForm(RegisterForm):
    first_name = WTextField('First Name', [validators.Required()])
    last_name = WTextField('Last Name', [validators.Required()])
    registration_type = SelectField('Type', choices=REGISTRATION_TYPE_CHOICES)
    region = SelectField("Region", choices=REGISTRATION_REGIONS)

    # applicable to UK only (these fields will be hidden with some javascript, when n/a)
    city = WTextField('Which City or Town?')

    mailing_list = BooleanField('Would you like to be on our mailing list?', default=False)


class InitialSelectionForm(ConditionalForm):
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


class HardwareLowtechForm(ConditionalForm):
    """
    Awaiting field spec
    """


class HardwareSimpleForm(ConditionalForm):
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

    speech_type = MultipleChoiceField(
        "Speech Type options?",
        choices=SPEECH_TYPE_CHOICES,
        required=True
    )

    synthesised_speech_type_choices = MultipleChoiceField(
        "Synthesized speech type options",
        choices=SYNTHESIZED_SPEECH_TYPE_CHOICES,
        display_rule=["speech_type", "in", [SPEECH_TYPE_SYNTHESISED]],
        required=True
    )

    no_voices = IntegerField(
        "No of voices available: n (int):",
        display_rule=["synthesised_speech_type_choices", "any", ""]
    )

    # the fields below are common to simple and advanced hardware types
    # I am violating dry by copying these fields to the other device choices
    # a better approach might be to just run two forms together ... will
    # investigate further when the lowtech hardware type is fleshed out

    images = GalleryField("Images", max_items=6)
    video_urls = MultiUrlField("Video Urls", required=False, max_items=2)

    more_info = MultiUrlField("More info",  required=False,max_items=10)

    #suppliers = SupplierField()

    discontinued = YesNoField(
        "Discontinued?"
    )

    short_description = TextField(
        "Short description",
        max_chars=1000)

    support_options = TextField(
        "Support options",
        max_chars=500)

    warranty_options = TextField(
        "Warranty options",
        max_chars=500)

    battery_life = IntegerField(
        "Battery life")

    spare_battery_options = TextField(
        "Spare battery options",
        max_chars=500)

    mounting_options = MultipleChoiceField(
        "Mounting options",
        choices=MOUNTING_OPTIONS_CHOICES
    )

    table_stand_available = YesNoField(
        "Table Stand availabile?")

    carrying_strap_available = YesNoField(
        "Carrying strap available?")

    more_details = TextField(
        "more details",
        max_chars=250)

    suppliers_usp_1 = TextField(
        "Unique selling point 1",
        max_chars=250)

    suppliers_usp_2 = TextField(
        "Unique selling point 2",
        max_chars=250)

    suppliers_usp_3 = TextField(
        "Unique selling point 3",
        max_chars=250)

    weight = IntegerField(
        "Weight (kg)")

    depth = IntegerField(
        "Depth: (mm)")

    height = IntegerField(
        "Height: (mm)")

    width = IntegerField(
        "Width (mm)"
    )

    screen_width = IntegerField(
        "Screen width"
    )

    screen_height = IntegerField(
        "Screen height"
    )

    screen_dimensions_incl_case = YesNoField(
        "Are these dimensions with a case?")

    enviro_control_capabilities = MultipleChoiceField(
        "Enviro Control capabilities",
        choices=ENVIROMENT_CAPABILITY_CHOICES,
        required=True
    )

    enviro_control_more_details = TextField(
        "More details"
    )

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

    has_max_locations_per_page = YesNoField(
        "Does it have a maximum number of locations per page?",
        display_rule=["has_min_target_size", "eq", YES_CHOICE],
        coerce=lambda x: x == "True" or x,
        required=True)

    max_locations_per_page = IntegerField(
        "What are the maximum number of locations per page?",
        display_rule=["has_max_locations_per_page", "eq", YES_CHOICE],
        required=True
    )

    # access_method eq ACCESS_METHOD_SWITCH

    scanning_options = MultipleChoiceField(
        "What scanning options are available (without additional software)",
        choices=SWITCH_SCANNING_CHOICES,
        display_rule=["access_method", "in", ACCESS_METHOD_SWITCH],
        required=True)


class HardwareAdvancedForm(ConditionalForm):

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

    dedicated = YesNoField(
        "Can I JUST run it as a communication aid and nothing else?",
        required=True
    )

    dedicated_more_info = TextField("more info", max_chars=255)

    accessability_features = TextField("Accessability features", max_chars=500)

    mobile_phone_capabilities = MultipleChoiceField(
        "Mobile phone capabilities",
        choices=MOBILE_PHONE_OPTIONS)

    mobile_phone_more_details = TextField(
        "More details",
        max_chars=500
    )

    # the fields below are common to simple and advanced hardware types
    # I am violating DRY by copying these fields to the other device choices
    # a better approach might be to just run two forms together ... will
    # investigate further when the lowtech hardware type is fleshed out

    images = GalleryField("Images", max_items=6)
    video_urls = MultiUrlField("Video urls", required=False, max_items=2)
    more_info = MultiUrlField("More info", required=False, max_items=10)

    #suppliers = SupplierField()

    discontinued = YesNoField(
        "Discontinued?"
    )

    short_description = TextField(
        "Short description",
        max_chars=1000)

    support_options = TextField(
        "Support options",
        max_chars=500)

    warranty_options = TextField(
        "Warranty options",
        max_chars=500)

    battery_life = IntegerField(
        "Battery life")

    spare_battery_options = TextField(
        "Spare battery options",
        max_chars=500)

    mounting_options = MultipleChoiceField(
        "Mounting options",
        choices=MOUNTING_OPTIONS_CHOICES
    )

    table_stand_available = YesNoField(
        "Table Stand availabile?")

    carrying_strap_available = YesNoField(
        "Carrying strap available?")

    carrying_strap_more_details = TextField(
        "more details",
        max_chars=250)

    suppliers_usp_1 = TextField(
        "Unique selling point 1",
        max_chars=250)

    suppliers_usp_2 = TextField(
        "Unique selling point 2",
        max_chars=250)

    suppliers_usp_3 = TextField(
        "Unique selling point 3",
        max_chars=250)

    weight = IntegerField(
        "Weight (kg)")

    depth = IntegerField(
        "Depth: (mm)")

    height = IntegerField(
        "Height: (mm)")

    width = IntegerField(
        "Width (mm)"
    )

    screen_width = IntegerField(
        "Screen width"
    )

    screen_height = IntegerField(
        "Screen height"
    )

    screen_dimensions_incl_case = YesNoField(
        "Are these dimensions with a case?")

    enviro_control_capabilities = MultipleChoiceField(
        "Enviro Control capabilities",
        choices=ENVIROMENT_CAPABILITY_CHOICES,
        required=True
    )

    enviro_control_more_details = TextField(
        "More details"
    )

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
        "Does it have a maximum number of locations per page?",
        display_rule=["has_min_target_size", "eq", YES_CHOICE],
        choices=NA_OR_YES_CHOICES,
        coerce=lambda x: x == "True" or x,
        required=True)

    max_locations_per_page = IntegerField(
        "What are the maximum number of locations per page?",
        display_rule=["has_max_locations_per_page", "eq", YES_CHOICE],
        required=True
    )

    # access_method eq ACCESS_METHOD_SWITCH

    scanning_options = MultipleChoiceField(
        "What scanning options are available (without additional software)",
        choices=SWITCH_SCANNING_CHOICES,
        display_rule=["access_method", "in", ACCESS_METHOD_SWITCH],
        required=True)


class VocabularyForm(ConditionalForm):
    """
    The vocabulary form
    """

    name = TextField("name")

    description = TextField("description")

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

    has_max_locations_per_page = YesNoField(
        "Does it have a maximum number of locations per page?",
        display_rule=["has_min_target_size", "eq", YES_CHOICE],
        coerce=lambda x: x in ["True", True],
        required=True)

    max_locations_per_page = IntegerField(
        "What are the maximum number of locations per page?",
        display_rule=["has_max_locations_per_page", "eq", YES_CHOICE],
        required=True
    )

    # access_method eq ACCESS_METHOD_SWITCH

    scanning_options = MultipleChoiceField(
        "What scanning options are available (without additional software)",
        choices=SWITCH_SCANNING_CHOICES,
        display_rule=["access_method", "in", ACCESS_METHOD_SWITCH],
        required=True)


class SoftwareForm(ConditionalForm):
    discontinued = YesNoField(
        "Discontinued?",
        required=True
    )

    images = GalleryField("Add images", max_items=6)
    videos = MultiUrlField("Add video urls", required=False, max_items=5)

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
        min_items=1,
        max_items=6,
        required=False
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
        "Does it have a maximum number of locations per page?",
        display_rule=["has_min_target_size", "eq", YES_CHOICE],
        choices=NA_OR_YES_CHOICES,
        coerce=lambda x: x == "True" or x,
        required=True)

    max_locations_per_page = IntegerField(
        "What are the max number of locations per page?",
        display_rule=["has_max_locations_per_page", "eq", YES_CHOICE],
        required=True
    )

        # access_method eq ACCESS_METHOD_SWITCH

    scanning_options = MultipleChoiceField(
        "What scanning options are available (without additional software)",
        choices=SWITCH_SCANNING_CHOICES,
        display_rule=["access_method", "in", ACCESS_METHOD_SWITCH],
        required=True)
