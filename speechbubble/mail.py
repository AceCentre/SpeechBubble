from .extensions import mandrill


class MandrillMail(object):
    """
    Used as a replacement to Flask-mail in Flask-security

    TODO: there appears to be a cleaner way to add mandrill support
          with flask-security by using the functionality provided
          to support email sending via celery.
          https://github.com/mattupstate/flask-security/issues/194
    """

    def send(self, message):

        from . import app

        mandrill.send_email(
            from_email=app.config['MANDRILL_DEFAULT_FROM'],
            to=[dict(email=recipient) for recipient in message.recipients],
            text=message.body,
            html=message.html,
            subject=message.subject
        )

