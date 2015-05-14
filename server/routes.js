/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/imports', require('./api/imports'));
  app.use('/api/rating', require('./api/rating'));
  app.use('/api/supplier', require('./api/supplier'));
  app.use('/api/product', require('./api/product'));
  app.use('/api/upload', require('./api/upload'));
  app.use('/api/contact', require('./api/contact'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/page', require('./api/page'));
  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
