#!/usr/bin/env python

from flask.ext.script import Manager

import pdb; pdb.set_trace()
from speechbubble import *
from speechbubble.views import *
from speechbubble.rest_views import *
from speechbubble.models import *
from speechbubble.auth import *

manager = Manager(app)

if __name__ == "__main__":
    manager.run()
