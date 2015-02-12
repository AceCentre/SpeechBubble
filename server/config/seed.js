/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    firstName: 'User',
    email: 'user@acecentre.org.uk',
    password: 'letmein'
  }, {
    provider: 'local',
    role: 'admin',
    firstName: 'Admin',
    email: 'admin@acecentre.org.uk',
    password: 'letmein'
  }, function() {
      console.log('finished populating users');
    }
  );
});
