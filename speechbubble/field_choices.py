# coding=utf-8
"""
Select list options.

NOTE: These may be migrated to MongoDB so they can managed via an admin interface, at some stage.
"""

REGISTRATION_TYPE_CHOICES = (
    ("professional", "Professional"),
    ("parent", "Parent"),
    ("aac_user", "AAC User"))

REGISTRATION_REGIONS = (
    ("uk", "UK"),
    ("Europe", "Europe"),
    ("USA", "USA"),
    ("Australia", "Australia"),
    ("Other", "Other"))

FIELD_CURRENCY_CHOICES = (
    ('GBP', 'GBP'),
    ('AUD', 'AUD'),
    ('USD', 'USD'))


YES_CHOICE = 'True'
NO_CHOICE = 'False'

NA_OR_YES_CHOICES = (
    (NO_CHOICE, "n/a"),
    (YES_CHOICE, "Yes"))


PRODUCT_TYPE_HARDWARE = "hardware"
PRODUCT_TYPE_APP = "app"
PRODUCT_TYPE_VOCABULARY = "vocabulary"

PRODUCT_TYPE_CHOICES = (
    (PRODUCT_TYPE_HARDWARE, 'Hardware'),
    (PRODUCT_TYPE_APP, 'App'),
    (PRODUCT_TYPE_VOCABULARY, 'Vocabulary'))


PRODUCT_HARDWARE_SUBTYPE_LOWTECH = "lowtech"
PRODUCT_HARDWARE_SUBTYPE_SIMPLE = "simple"
PRODUCT_HARDWARE_SUBTYPE_ADVANCED = "advanced"

PRODUCT_HARDWARE_SUBTYPE_CHOICES = (
    (PRODUCT_HARDWARE_SUBTYPE_LOWTECH, "Low tech"),
    (PRODUCT_HARDWARE_SUBTYPE_SIMPLE, "Simple"),
    (PRODUCT_HARDWARE_SUBTYPE_ADVANCED, "Advanced"))

VOCAB_PRESENTATION_TEXT = "text"
VOCAB_PRESENTATION_TEXT_AND_SYMBOLS = "text_and_symbols"
VOCAB_PRESENTATION_SYMBOLS_AND_PHOTOS = "symbols_and_photos"

VOCAB_PRESENTATION_CHOICES = (
    ("text", "Text only"),
    ("text_and_symbols", "Text & Symbols"),
    ("symbols_or_photos", "Symbols or Photos Only"))


VOCAB_TEXT_PRESENTED_KEYBOARD = "keyboard"
VOCAB_TEXT_PRESENTED_SINGLEWORDS = "singlewords"
VOCAB_TEXT_PRESENTED_PHRASES = "phrases"

VOCAB_TEXT_PRESENTED_CHOICES = (
    (VOCAB_TEXT_PRESENTED_KEYBOARD, 'Keyboard'),
    (VOCAB_TEXT_PRESENTED_SINGLEWORDS, 'Single words'),
    (VOCAB_TEXT_PRESENTED_PHRASES, 'Phrases'))


VOCAB_WORD_START_PAGE_SINGULAR = "singular"
VOCAB_WORD_START_PAGE_PHRASES = "phrases"
VOCAB_WORD_START_PAGE_SINGULAR_WORDS_PHRASES = "singular_words_phrases"

VOCAB_WORD_START_PAGE_CHOICES = (
    (VOCAB_WORD_START_PAGE_SINGULAR, "Singular words"),
    (VOCAB_WORD_START_PAGE_PHRASES, "Phrases (e.g. \"I want\")"),
    (VOCAB_WORD_START_PAGE_SINGULAR_WORDS_PHRASES, "Singluar words & Phrases"))

VOCAB_WORD_OTHER_SCHEMATICALLY = "schematically"
VOCAB_WORD_OTHER_TAXONOMICALLY = "taxonomically"
VOCAB_WORD_OTHER_SIMILAR = "similar"

VOCAB_WORD_OTHER_CHOICES = (
    (VOCAB_WORD_OTHER_SCHEMATICALLY, "Schematically (e.g. around activities)"),
    (VOCAB_WORD_OTHER_TAXONOMICALLY, "Taxonomically (e.g. in Catgeogies such as Food, Toys)"),
    (VOCAB_WORD_OTHER_SIMILAR, "Similar meaning locations"))


VOCAB_PHRASE_START_PAGE_SINGULAR = "singular"
VOCAB_PHRASE_START_PAGE_PHRASES = "phrases"
VOCAB_PHRASE_START_PAGE_SINGULAR_PHRASES_PHRASES = "singular_words_phrases"

VOCAB_PHRASE_START_PAGE_CHOICES = (
    (VOCAB_PHRASE_START_PAGE_SINGULAR, "Singular words"),
    (VOCAB_PHRASE_START_PAGE_PHRASES, "Phrases (e.g. \"I want\")"),
    (VOCAB_PHRASE_START_PAGE_SINGULAR_PHRASES_PHRASES, "Singluar words & Phrases"))

VOCAB_PHRASE_OTHER_SCHEMATICALLY = "schematically"
VOCAB_PHRASE_OTHER_TAXONOMICALLY = "taxonomically"
VOCAB_PHRASE_OTHER_SIMILAR = "similar"

VOCAB_PHRASE_OTHER_CHOICES = (
    (VOCAB_PHRASE_OTHER_SCHEMATICALLY, "Schematically (e.g. around activities)"),
    (VOCAB_PHRASE_OTHER_TAXONOMICALLY, "Taxonomically (e.g. in Catgeogies such as Food, Toys)"),
    (VOCAB_PHRASE_OTHER_SIMILAR, "Similar meaning locations"))

ENVIROMENT_CAPABILITY_CHOICES = (
    ('built_in', 'Built-in'),
    ('additional_hardware', 'Additional hardware available'),
    ('None', 'None')
)

VISUAL_OPTIONS = (
    ('zoom', 'Zoom'),
    ('cellhighlight', 'Cell Highlight'),
    ('changeablecellhighlight', 'Changeable Cell Highlight'),
    ('editablefontstyles', 'Editable Font Styles'))

ACCESS_METHOD_TOUCH = "touch"
ACCESS_METHOD_MOUSE = "mouse"
ACCESS_METHOD_EYEGAZE = "eyegaze"
ACCESS_METHOD_SWITCH = "switch"

ACCESS_METHOD_CHOICES = (
    (ACCESS_METHOD_TOUCH, "Touch"),
    (ACCESS_METHOD_MOUSE, "Mouse or Mouse alternative e.g. Joystick"),
    (ACCESS_METHOD_EYEGAZE, "Eyegaze"),
    (ACCESS_METHOD_SWITCH, "Switch"))

SUPPORTED_TOUCH_OTHER = "other"

SUPPORTED_TOUCH_FEATURES = (
    ("Accept on Enter", "Accept on Enter"),
    ("Accept on Exit", "Accept on Exit"),
    ("Hold time", "Hold time"),
    ("Debounce", "Debounce"),
    ("Auditory fishing", "Auditory fishing"),
    (SUPPORTED_TOUCH_OTHER, "Other"))


SWITCH_SCANNING_CROSSHAIR = "crosshair"
SWITCH_SCANNING_COLUMNROW = "columnrow"
SWITCH_SCANNING_ROWCOLUMN = "rowcolumn"
SWITCH_SCANNING_BLOCK = "block"
SWITCH_SCANNING_QUARTERED = "quartered"
SWITCH_SCANNING_MORSE = "morse"

SWITCH_SCANNING_CHOICES = (
    (SWITCH_SCANNING_CROSSHAIR, "Crosshair"),
    (SWITCH_SCANNING_COLUMNROW, "Column Row"),
    (SWITCH_SCANNING_ROWCOLUMN, "Row Column"),
    (SWITCH_SCANNING_BLOCK, "Block"),
    (SWITCH_SCANNING_QUARTERED, "Quartered"),
    (SWITCH_SCANNING_MORSE, "Morse"))

SUPPORTED_TOUCH_TYPES = (
    ('capactive', 'Capactive'),
    ('resistive', 'Resistive'))

SPEECH_TYPE_SYNTHESISED = "synthesised"

SPEECH_TYPE_CHOICES = (
    ('None', 'None'),
    (SPEECH_TYPE_SYNTHESISED, 'Synthesised'),
    ('recorded', 'Recorded'))

IMAGE_REPRESENTATION_SYMBOLS = "symbols"

IMAGE_REPRESENTATION_CHOICES = (
    ('photos', 'Photos'),
    (IMAGE_REPRESENTATION_SYMBOLS, 'Symbols'),
    ('none', 'None (text only)'),
    ('videos', 'Videos'))

SYNTHESIZED_SPEECH_TYPE_CHOICES = (
    ('Acapela', 'Acapela'),
    ('at&t', 'AT&T'),
    ('Cepstral', 'Cepstral'),
    ('CereProc', 'CereProc'),
    ('espeak', 'eSpeak'),
    ('ekho', 'Ekho'),
    ('festival', 'Festival'),
    ('freetts', 'FreeTTS'),
    ('ivona', 'Ivona'),
    ('neospeech', 'Neospeech'),
    ('nuance_loquendo', 'Nuance Loquendo'),
    ('nuance_vocalizer', 'Nuance Vocalizer'),
    ('praat', 'Praat'),
    ('nuance_svox', 'Nuance SVOX'))

SUPPORTED_OPERATING_SYSTEM_CHOICES = (
    ('winxp', 'Microsoft Windows XP'),
    ('win7', 'Microsoft Windows 7'),
    ('win8', 'Microsoft Windoes 8'),
    ('win8Pro', 'Microsoft Windows 8 Pro'),
    ('osx10_0', 'Mac OS X 10.0 (Cheetah)'),
    ('osx10_1', 'Mac OS X 10.1 (Puma)'),
    ('osx10_2', 'Mac OS X 10.2 (Jaguar)'),
    ('osx10_3', 'Mac OS X 10.3 (Panther)'),
    ('osx10_4', 'Mac OS X 10.4 (Tiger)'),
    ('osx10_5', 'Mac OS X 10.5 (Leopard)'),
    ('osx10_6', 'Mac OS X 10.6 (Snow Leopard)'),
    ('osx10_7', 'Mac OS X 10.7 (Lion)'),
    ('osx10_8', 'Mac OS X 10.8 (Mountain Lion)'),
    ('osx10_9', 'Mac OS X 10.9 Mavericks)'),
    ('osx10_10', 'Mac OS X 10.10 (Yosemite)'),
    ('android_4.4', 'Android 4.4 KitKat'),
    ('android_4_3', 'Android 4.3 Jelly Bean'),
    ('android_4_2.x', 'Android 4.2.x'),
    ('android_4_1_x', 'Android 4.1.x'),
    ('android_4_0_3-4_0_4', 'Android 4.0.3-4.0.4 Ice Cream Sandwich'),
    ('android_2_3_3-3_3_7', 'Android 2.3.3-2.3.7 Gingerbread'),
    ('android_2_2', 'Android 2.2 Froyo'),
    ('Microsoft Pocket PC 200', 'Microsoft Pocket PC 2000'),
    ('Microsoft Pocket PC 2002', 'Microsoft Pocket PC 2002'),
    ('Microsoft Windows Mobile 2003', 'Microsoft Windows Mobile 2003'),
    ('Microsoft Windows Mobile 2003 SE', 'Microsoft Windows Mobile 2003 SE'),
    ('Microsoft Windows Mobile 5.0', 'Microsoft Windows Mobile 5.0'),
    ('Microsoft Windows Mobile 6', 'Microsoft Windows Mobile 6'),
    ('Microsoft Windows Mobile 6.1', 'Microsoft Windows Mobile 6.1'),
    ('Microsoft Windows Mobile 6.5', 'Microsoft Windows Mobile 6.5'),
    ('ios1', 'Apple iOS 1'),
    ('ios2', 'Apple iOS 2'),
    ('ios3', 'Apple iOS 3'),
    ('ios4', 'Apple iOS 4'),
    ('ios5', 'Apple iOS 5'),
    ('ios6', 'Apple iOS 6'),
    ('ios7', 'Apple iOS 7'),
    ('ios8', 'Apple iOS 8'))

SUPPORT_SYMBOLS_CHOICES = (
    ('PCS - Thinline', 'PCS - Thinline'),
    ('PCS - Classic', 'PCS - Classic'),
    ('PCS - Persona', 'PCS - Persona'),
    ('PCS - High Contrast', 'PCS - High Contrast'),
    ('PCS - Animations', 'PCS - Animations'),
    ('Widgit - Standard', 'Widgit - Standard'),
    ('Widgit - VI', 'Widgit - VI'),
    ('Snaps', 'Snaps'),
    ('Makaton Signs and Symbols', 'Makaton Signs and Symbols'),
    ('ARASAAC', 'ARASAAC'),
    ('Mulberry', 'Mulberry'),
    ('SymbolStix', 'SymbolStix'),
    ('Noun Project', 'Noun Project'),
    ('Pixon Pictures', 'Pixon Pictures'),
    ('Minspeak icons', 'Minspeak icons'),
    ('Metacom', 'Metacom'),
    ('Ablenet', 'Ablenet'),
    ('Smarty', 'Smarty'),
    ('Other', 'Other'),
    ('Bliss', 'Bliss'),
    ('Dynasims', 'Dynasims'),
    ('Sclera', 'Sclera'))

SCANNING_OPTIONS = (
    ('Crosshair', 'Crosshair'),
    ('Column Row', 'Column Row'),
    ('Row Column', 'Row Column'),
    ('Block', 'Block'),
    ('Quartered', 'Quartered'),
    ('Morse', 'Morse'))

MOUNTING_OPTIONS_CHOICES = (
    ("none", "None"),
    ("Daessy", "Daessy"),
    ("Rehadapt", "Rehadapt"),
    ("Other", "Other"))

MOBILE_PHONE_OPTIONS = (
    ("None", "None"),
    ("Phone/Texting controllable from AAC Software", "Phone/Texting controllable from AAC Software"),
    ("Phone/texting controllable via copy/paste functionality", "Phone/texting controllable via copy/paste functionality"))
