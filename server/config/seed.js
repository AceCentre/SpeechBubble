/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Supplier = require('../api/supplier/supplier.model');
var Product = require('../api/product/product.model').Model;
var ProductSimple = require('../api/product/types/product-hardware-simple');
var chance = require('chance').Chance();
var _ = require('lodash');
var ENUM = require('../enum');

Product.find().remove(function() {
  Supplier.find().remove(function() {
    var regions = ENUM.REGION.slice(1);
    _.times(200, function() {
        Supplier.create({
          name: chance.word() + ' Ltd',
          url: chance.url(),
          supportDetails: chance.email(),
          regions: chance.pick(regions, chance.integer({ min: 0, max: regions.length - 1}))
        }, function(err, supplier) {
          ProductSimple.create({
            name: chance.word(),
            description: chance.paragraph(),
            discontinued: chance.bool(),
            supplier: supplier._id
          });
        });
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
        password: chance.word(),
        active: chance.bool(),
        subscribe: chance.bool()
      });
  });
});
