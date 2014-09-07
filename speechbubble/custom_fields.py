from __future__ import unicode_literals

from .fields import BaseField


__all__ = ['VocabField', 'GalleryField', 'MultiUrlField', 'MultiPriceField']


class BaseMultiItemField(BaseField):
    def __init__(self, *args, **kwargs):
        self._max_items = kwargs.pop('max_items', None)
        self._min_required = kwargs.pop('min_required', None)


class VocabField(BaseMultiItemField):
    pass


class GalleryField(BaseMultiItemField):
    pass


class MultiUrlField(BaseMultiItemField):
    pass


class MultiPriceField(BaseMultiItemField):
    pass