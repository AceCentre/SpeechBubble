/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Supplier = require('../api/supplier/supplier.model');
var chance = require('chance').Chance();
var _ = require('lodash');
var ENUM = require('../enum');

Supplier.find().remove(function() {
  var regions = ENUM.REGION.slice(1);
  _.times(200, function() {
      Supplier.create({
        name: chance.word() + ' Ltd',
        url: chance.url(),
        supportDetails: chance.email(),
        regions: chance.pick(regions, chance.integer({ min: 0, max: regions.length - 1}))
      });
  });
});

User.find().remove(function() {
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
