!#/usr/bin/env python
"""
Set up initial data in mongo:

Admin/Moderator/Editor roles and 3 x test users

NOTE: this script is not currently working/tested. It's still WIP.
"""

user_datastore.create_role(name="Admin", description="Admin: has full access")
user_datastore.create_role(name="Moderator", description="Moderator: can pubish, edit and reject document changes")
user_datastore.create_role(name="Editor", description="Editor: can amend and submit changes to documents")

echo "Done."