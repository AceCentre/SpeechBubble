from __future__ import unicode_literals

from .fields import BaseField, ValidationError


__all__ = ['VocabField', 'GalleryField', 'MultiUrlField', 'MultiPriceField']


class BaseMultiItemField(BaseField):
    def __init__(self, *args, **kwargs):
        self.max_items = kwargs.pop('max_items', None)
        self.min_items = kwargs.pop('min_items', 1)

        initial = kwargs.pop('initial', None)

        if initial is None:
            initial = ["" for _ in range(self.min_items)]

        super(BaseMultiItemField, self).__init__(*args, initial=initial, **kwargs)


class VocabField(BaseMultiItemField):
    pass


class GalleryField(BaseMultiItemField):
    pass


class MultiUrlField(BaseMultiItemField):
    def __init__(self, *args, **kwargs):

        super(MultiUrlField, self).__init__(*args, **kwargs)

    def validate(self):
        field_data = super(MultiUrlField, self).validate()

        if not field_data:
            field_data = self.initial

        item_count = sum(1 for item in field_data if item)

        if item_count < self.min_items:
            raise ValidationError(
                "At least {} items required".format(self.min_items))

        if self.max_items is not None and item_count > self.max_items:
            raise ValidationError(
                "No more than {} items allowed".format(self.max_items))

        return field_data


class MultiPriceField(BaseMultiItemField):
    pass


class SupplierField(BaseMultiItemField):
    pass