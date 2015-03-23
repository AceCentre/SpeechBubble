'use strict';

var express = require('express');
var controller = require('./product.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

// View Products
router.get('/', controller.index);
router.get('/:id/revisions', auth.isAuthenticated(), controller.revisions);
router.get('/:id', controller.show);

// Product Admin
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

// User Product Admin
router.get('/upload/:productId', controller.listImages);
router.post('/upload/:productId', controller.addImages);
router.delete('/upload/:productId/:imageId', controller.deleteImage);

module.exports = router;
