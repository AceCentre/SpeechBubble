#!/usr/bin/env python

from flask.ext.script import Manager

from speechbubble import *
from speechbubble.views import *
from speechbubble.models import *
from speechbubble.angular_helpers import *
from speechbubble.auth import *

manager = Manager(app)

@manager.command
def setup_admin():
    """
    Set up an admin user admin@speechbubble.com and assign the Admin role.

    NOTE these are just temporary test details. This management command will not exist
    in the production codebase.
    """
    Role.objects(name="Moderator").update_one(upsert=True, set__name="Moderator")
    Role.objects(name="Admin").update_one(upsert=True, set__name="Admin")
    User.objects(email="admin@speechbubble.com").update_one(upsert=True,
                                                                   set__email="admin@speechbubble.com",
                                                                   set__password="letmein",
                                                                   set__active=True)

    user = User.objects(email="admin@speechbubble.com").first()
    role = Role.objects(name="Admin").first()

    user.roles.append(role)
    user.save()


if __name__ == "__main__":
    manager.run()
