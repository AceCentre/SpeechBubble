/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var chance = require('chance').Chance();
var _ = require('lodash');

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

  _.times(200, function() {
      User.create({
        provider: 'local',
        firstName: chance.first(),
        lastName: chance.last(),
        email: chance.email(),
        password: chance.word()
      });
  });
});
