'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

// Authenticated User
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/me', auth.isAuthenticated(), controller.update);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);

// Admin
router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.put('/:id', auth.hasRole('admin'), controller.adminUpdate);

// User
router.get('/activate/:id', controller.activate);
router.post('/', controller.create);

module.exports = router
