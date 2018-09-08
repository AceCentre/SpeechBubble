/**
 * Main application file
 */

'use strict';
var pmx = require('pmx').init({
  http          : true, // HTTP routes logging (default: true)
  errors        : true, // Exceptions loggin (default: true)
  custom_probes : true, // Auto expose JS Loop Latency and HTTP req/s as custom metrics
  network       : true, // Network monitoring at the application level
  ports         : true,  // Shows which ports your app is listening on (default: false)
  alert_enabled : true  // Enable alert sub field in custom metrics   (default: false)
});

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

mongoose.set('debug', false);

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options)
  .catch((err) => {
    console.error("mongoose connect failure: ", err);
    process.exit(-1);
  });

// Populate DB with sample data
if(config.seedDB || process.env.SEED_DB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
