'use strict';

var express = require('express');
var controller = require('./product.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

// View Products
router.get('/', controller.index);
router.get('/:id', controller.show);

// Product Admin
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

// User Product Admin
router.get('/upload/:productId', controller.listImages);
router.post('/upload/:productId', controller.addImages);
router.delete('/upload/:productId/:imageId', controller.deleteImage);

module.exports = router;
