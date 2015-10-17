/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Supplier = require('../api/supplier/supplier.model');
var Product = require('../api/product/product.model');
var Glossary = require('../api/glossary/glossary.model');
var Rating = require('../api/rating/rating.model').Rating;
var chance = require('chance').Chance();
var _ = require('lodash');
var ENUM = require('../enum');

// User.find().remove(function() {
//   User.create({
//     provider: 'local',
//     firstName: 'User',
//     email: 'user@acecentre.org.uk',
//     password: 'letmein'
//   });

//   User.create({
//       provider: 'local',
//       role: 'admin',
//       firstName: 'Admin',
//       email: 'admin@acecentre.org.uk',
//       password: 'letmein'
//     }, function(err, user) {
//       Product.find().remove(function() {
//         Supplier.find().remove(function() {
//           var regions = ENUM.REGION.slice(1);
//           var types = ENUM.PRODUCT_TYPES;
//           _.times(200, function() {
//             Supplier.create({
//               name: chance.word() + ' Ltd',
//               url: chance.url(),
//               supportDetails: chance.email(),
//               regions: chance.pick(regions, chance.integer({ min: 0, max: regions.length - 1}))
//             }, function(err, supplier) {
//               Product.create({
//                 name: chance.sentence({ words: 5 }),
//                 description: chance.paragraph(),
//                 type: chance.pick(types, chance.integer({ min: 0, max: types.length - 1})),
//                 discontinued: chance.bool() || '',
//                 note: 'Test published commit note',
//                 suppliers: [supplier._id],
//                 features: {
//                   price: {
//                     gbp: chance.integer({ min: 0, max: 2000 })
//                   }
//                 },
//                 author: user._id
//               }, function(err, product) {
//                 console.log(err);
//                 if(!err) {
//                   Rating.find().remove(function () {
//                     var reviews = [];
//                     _.times(chance.integer({min: 0, max: 20}), function () {
//                       reviews.push({
//                         author: user._id,
//                         ratings: {
//                           reliability: chance.integer({min: 1, max: 5}),
//                           easeOfUse: chance.integer({min: 1, max: 5})
//                         },
//                         comment: chance.paragraph(),
//                         visible: chance.bool()
//                       });
//                     });
//                     Rating.create({
//                       product: product._id,
//                       reviews: reviews
//                     });
//                   });
//                 }
//               });
//             });
//           });
//         });
//       });
//     }
//   );

//   _.times(200, function() {
//     User.create({
//       provider: 'local',
//       firstName: chance.first(),
//       lastName: chance.last(),
//       email: chance.email(),
//       password: chance.word(),
//       active: chance.bool(),
//       subscribe: chance.bool()
//     });
//     Glossary.create({
//       'title': chance.sentence({ 'words': 5 }),
//       'description': chance.paragraph()
//     })
//   });
// });
