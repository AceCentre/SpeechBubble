#!/usr/bin/env python

from flask.ext.script import Manager

from speechbubble import *
from speechbubble.views import *
from speechbubble.models import *
from speechbubble.auth import *


if __name__ == "__main__":
    app.debug = True
    app.run()
