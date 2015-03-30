/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Supplier = require('../api/supplier/supplier.model');
var Product = require('../api/product/product.model');
var ProductRevision = require('../api/product/product-revision.model');
var Rating = require('../api/rating/rating.model').Rating;
var chance = require('chance').Chance();
var _ = require('lodash');
var ENUM = require('../enum');

User.find().remove(function() {
  User.create({
    provider: 'local',
    firstName: 'User',
    email: 'user@acecentre.org.uk',
    password: 'letmein'
  });

  User.create({
      provider: 'local',
      role: 'admin',
      firstName: 'Admin',
      email: 'admin@acecentre.org.uk',
      password: 'letmein'
    }, function(err, user) {
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
              ProductRevision.create({
                name: chance.word(),
                description: chance.paragraph(),
                discontinued: chance.bool() || '',
                suppliers: [supplier._id],
                note: 'Test commit note'
              }, function(err, revision) {
                Product.create({
                  name: chance.word(),
                  description: chance.paragraph(),
                  type: chance.pick(types, chance.integer({ min: 0, max: types.length - 1})),
                  discontinued: chance.bool() || '',
                  note: 'Test published commit note',
                  suppliers: [supplier._id],
                  features: {
                    price: {
                      gbp: chance.integer({ min: 0, max: 2000 })
                    }
                  },
                  _revisions: [revision._id]
                }, function(err, product) {
                  if(!err) {
                    Rating.find().remove(function () {
                      var reviews = [];
                      _.times(chance.integer({min: 1, max: 20}), function () {
                        reviews.push({
                          author: user._id,
                          rating: chance.integer({min: 1, max: 5}),
                          comment: chance.paragraph(),
                          visible: chance.bool()
                        });
                      });
                      Rating.create({
                        product: product._id,
                        reviews: reviews
                      });
                    });
                  }
                });
              });
            });
          });
        });
      });
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


