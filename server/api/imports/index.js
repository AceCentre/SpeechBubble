'use strict';

var express = require('express');
var controller = require('./import.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/appsforaac', auth.hasRole('admin'), controller.importAppsForAAC);

module.exports = router;
