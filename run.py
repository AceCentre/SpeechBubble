#!/usr/bin/env python

from acecentre.app import *
from acecentre.views import *
from acecentre.models import *
from acecentre.auth import *

if __name__ == "__main__":
    app.debug = True
    app.run()
