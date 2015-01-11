
from multistage.forms import BaseFormStage, BaseMultiForm


class ImageUploadStage(BaseFormStage):

    template_name = "images.html"

    def __init__(self, data_field, min_images=0, max_images=0):
        """
        :param: data_field indicates what field the image data should
        be stored against, e.g. 'product_images'

        :param: min_images the minimum number of images, 0 means not required

        :param: max_images the max number of images, 0 means unlimited
        """









