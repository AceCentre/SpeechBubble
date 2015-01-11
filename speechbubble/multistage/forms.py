
class BaseMultiForm(object):
    def __init__(self):
        pass

    def is_valid(self):
        pass

    def save(self):
        pass

    def load(self):
        pass

    def render(self):
        pass

    def get_all_stages_and_statuses(self):

        stages = []

        for stage in self._forms:
            stages.append(stage(self._data).text_status())

        return stages


class BaseMultiStageForm(object):

    def __init__(self, data):
        self._data = data

    def is_valid(self):
        return not self._form_instance.errors

    def text_status(self):
        """
        A short human readable statement indicating the status
        of the form stage, e.g.

        Completed
        Incompleted
        2 Images
        """
        if self.is_valid():
            return 'Complete'
        else:
            return 'Incomplete'

    @property
    def errors(self):
        return self._form_instance.errors

    def render(self, context):
        pass

    def get_url(self):
        pass

    def from_post(self):
        pass



