'use strict';

var express = require('express');
var controller = require('./product.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

// User Product Admin
router.get('/upload/:productId', controller.listImages);
router.post('/upload/:productId', auth.isAuthenticated(), controller.addImages);
router.post('/', auth.isAuthenticated(), controller.create); // Create a new product
router.put('/:id', auth.isAuthenticated(), controller.update); // Create a new product revision

// Update slug for all products based on name
router.get('/slugify', auth.hasRole('admin'), controller.slugify);

// View Products
router.get('/', controller.index);
router.get('/similar', controller.similar);
router.get('/compare', controller.compare);
router.get('/:id/revisions', auth.isAuthenticated(), controller.revisions);
router.get('/supportedForVocabulary/', controller.getSupportedForVocabulary);
router.get('/:slug/:revisionId', controller.showRevision);
router.get('/:slug', auth.attachUser(), controller.show);

// Product Admin
router.delete('/:id/:revisionId', auth.hasRole('admin'), controller.destroyRevision);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.post('/publish/:id/:revisionId', auth.hasRole('admin'), controller.publish); // publish a revision
router.delete('/upload/:productId/:imageId', auth.hasRole('admin'), controller.deleteImage);

module.exports = router;
