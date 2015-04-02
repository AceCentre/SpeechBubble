'use strict';

var express = require('express');
var controller = require('./rating.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.list);
router.get('/:id', controller.show);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
