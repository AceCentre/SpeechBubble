from __future__ import unicode_literals

from .fields import BaseField


__all__ = ['VocabField', 'GalleryField', 'MultiUrlField', 'MultiPriceField']


class BaseMultiItemField(BaseField):
    def __init__(self, *args, **kwargs):
        self.max_items = kwargs.pop('max_items', None)
        self.min_items = kwargs.pop('min_items', 1)

        initial = kwargs.pop('initial', None)

        if initial is None:
            initial = [[] * self.min_items]

        super(BaseMultiItemField, self).__init__(*args, initial=initial, **kwargs)


class VocabField(BaseMultiItemField):
    pass


class GalleryField(BaseMultiItemField):
    pass


class MultiUrlField(BaseMultiItemField):
    def __init__(self, *args, **kwargs):

        super(MultiUrlField, self).__init__(*args, **kwargs)


class MultiPriceField(BaseMultiItemField):
    pass