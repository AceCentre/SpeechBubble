/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Supplier = require('../api/supplier/supplier.model');
var Product = require('../api/product/product.model').Model;
var chance = require('chance').Chance();
var _ = require('lodash');
var ENUM = require('../enum');

Product.find().remove(function() {
  Supplier.find().remove(function() {
    var regions = ENUM.REGION.slice(1);
    var types = ENUM.PRODUCT_TYPES;
    _.times(200, function() {
        Supplier.create({
          name: chance.word() + ' Ltd',
          url: chance.url(),
          supportDetails: chance.email(),
          regions: chance.pick(regions, chance.integer({ min: 0, max: regions.length - 1}))
        }, function(err, supplier) {
          Product.create({
            name: chance.word(),
            description: chance.paragraph(),
            type: chance.pick(types, chance.integer({ min: 0, max: types.length - 1})),
            discontinued: chance.bool(),
            suppliers: [supplier._id],
            images: [{
              url: '/assets/images/products/default.png',
              summary: 'No image'
            }]
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
