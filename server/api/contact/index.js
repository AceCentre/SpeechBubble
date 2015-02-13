'use strict';

var express = require('express');
var controller = require('./contact.controller');

var router = express.Router();

router.post('/', controller.send);

module.exports = router;
