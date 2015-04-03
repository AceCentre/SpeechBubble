'use strict';

var express = require('express');
var controller = require('./rating.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.list);
router.get('/:id', controller.show);
router.post('/:id', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id/:ratingId', auth.hasRole('admin'), controller.remove);

module.exports = router;
