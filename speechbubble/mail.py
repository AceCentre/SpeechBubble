from .extensions import mandrill


class MandrillMail(object):
    """
    Used as a replacement to Flask-mail in Flask-security
    """

    def send(self, message):

        mandrill.send_email(
            from_email="lyndon@antlyn.com", #message.sender,
            to=[dict(email=recipient) for recipient in message.recipients],
            text=message.body,
            html=message.html,
            subject=message.subject
        )


