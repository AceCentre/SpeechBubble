'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var jade = require('jade');
var Product = require('./product.model');
var ProductRevision = require('./product-revision.model');
var formidable = require('formidable');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_API_KEY);

function mapSuppliers(suppliers) {
  return suppliers.map(function(supplier) {
    return _.isString(supplier) ? supplier: supplier._id;
  });
}

exports.compare = function(req, res) {
  Product
  .find({ '_id': { $in: req.query.products.split(',') }})
  .limit(4)
  .exec(function(err, products) {
    if(err) { return handleError(res, err); }
    res.send(200, products);
  });
};

function addToQuery(query, name, value, shouldAdd) {
  if(shouldAdd) {
    query[name] = value;
  }
}

// Get list of products
exports.index = function(req, res) {
  var skip = req.query.skip || 0;
  var limit = req.query.limit || 10;
  var term = req.query.term;

  var orQuery = [];
  var query = {};


  if(term) {
    orQuery.push({ $text: { $search: term } });
  }

  addToQuery(query, 'type', req.query.type, req.query.type);

  // ADMIN FILTERS
  addToQuery(query, 'awaitingModeration', true, req.query.awaitingModeration === 'true');

  // HARDWARE FILTERS

  if(req.query.type === 'ProductHardware') {
    var mobilePhone = req.query.mobilePhone && JSON.parse(req.query.mobilePhone);
    var batteryLife = req.query.batteryLife;
    var screenSize = req.query.screenSize;

    addToQuery(query, 'features.battery.batteryLife', {
      $gte: parseInt(batteryLife, 10)
    }, batteryLife);

    addToQuery(query, 'features.dimensions.screenSize', {
      $gte: parseInt(screenSize, 10)
    }, screenSize);

    _.each(mobilePhone, function(value, key) {
      if(value) {
        var temp = {};
        temp['features.mobilePhone.' + key] = value;
        orQuery.push(temp);
      }
    });
  }

  // SOFTWARE FILTERS
  if(req.query.type === 'ProductSoftware') {
    var imageRepresentation = req.query.imageRepresentation && JSON.parse(req.query.imageRepresentation);
    var speechTypeOptions = req.query.speechTypeOptions && JSON.parse(req.query.speechTypeOptions);

    _.each(speechTypeOptions, function(value, key) {
      if(value) {
        var temp = {};
        temp['features.speechTypeOptions.' + key] = value;
        orQuery.push(temp);
      }
    });

    _.each(imageRepresentation, function(value, key) {
      if(value) {
        var temp = {};
        temp['features.imageRepresentation.' + key] = value;
        orQuery.push(temp);
      }
    });
  }

  // VOCABULARY FILTERS
  if(req.query.type === 'ProductVocabulary') {
    var presentation = req.query.presentation && JSON.parse(req.query.presentation);

    _.each(presentation, function(value, key) {
      if(value) {
        var temp = {};
        temp['features.presentation'] = key;
        orQuery.push(temp);
      }
    });
  }

  // NOT LOW TECH FILTERS
  if(req.query.type !== 'ProductLowTech') {
    var devices = req.query.devices;
    var accessMethods = req.query.accessMethods && JSON.parse(req.query.accessMethods);

    addToQuery(query, 'features.operatingSystems', {
      $in: _.isArray(devices) ? devices: [devices]
    }, devices);

    _.each(accessMethods, function(value, key) {
      if(value) {
        var temp = {};
        temp['features.accessMethods.' + key] = value;
        orQuery.push(temp);
      }
    });
  }

  orQuery = orQuery.length ? orQuery: null;

  Product
  .find(query)
  .or(orQuery)
  .count(function(err, total) {
    if(err) { return handleError(res, err); }
    Product
    .find(query)
    .or(orQuery)
    .sort({ name: 'asc' })
    .skip(skip)
    .limit(limit)
    .populate('suppliers')
    .exec(function (err, products) {
      if(err) { return handleError(res, err); }
      return res.json(200, {
        total: total,
        items: products
      });
    });
  });
};

// Get a single product
exports.show = function(req, res) {
  Product
  .findById(req.params.id)
  .populate('suppliers')
  .populate('_revisions')
  .exec(function (err, product) {
    if(err) { return handleError(res, err); }
    if(!product) { return res.send(404); }
    return res.json(product);
  });
};

// Creates a new product in the DB.
exports.create = function(req, res) {
  Product.create({
    name: req.body.name,
    description: req.body.description,
    type: req.body.type,
    author: req.user._id
  }, function(err, product) {
    if(err) { return handleError(res, err); }
    return res.json(201, product);
  });
};

// Adds a new revision to a product
exports.publish = function(req, res) {
  var productId = req.params.id;
  var revisionId = req.params.revision;

  Product
  .findById(productId)
  .lean()
  .exec(function(err, product) {
    if (err) {
      return handleError(res, err);
    }
    if (!product) {
      return res.send(404);
    }
    ProductRevision
    .findById(revisionId)
    .lean()
    .exec(function(err, revision) {
      if (err) {
        return handleError(res, err);
      }
      if (!revision) {
        return res.send(404);
      }

      // delete revision document specific properties
      delete revision._id;
      delete revision.__t;
      delete revision.createdAt;
      delete revision.updatedAt;

      revision._revisions = product._revisions;
      revision.type = product.type;
      revision.currentRevision = revisionId;

      // If we are publishing the latest revision remove moderation flag
      if(_.last(revision._revisions) === revisionId) {
        revision.awaitingModeration = false;
      }

      Product.update({ _id: productId }, revision, { overwrite: true, multi: false }, function(err, numberAffected, raw) {
        if (err) {
          return handleError(res, err);
        }
        mandrill_client.messages.send({
          message: {
            html: jade.renderFile(path.resolve(__dirname, 'emails/revision-published.jade'), {
              url: process.env.DOMAIN + '/products/' + req.params.id,
              revision: revisionId
            }),
            subject: 'New Product Revision Published',
            from_email: 'no-reply@speechbubble.org.uk',
            from_name: 'SpeechBubble Admin',
            to: [{
              email: process.env.SUPPORT_EMAIL,
              name: 'SpeechBubble Admin',
              type: 'to'
            }],
            auto_text: true
          }
        }, function(result) {
          Product
            .findById(productId)
            .populate('suppliers')
            .exec(function(err, product) {
              if (err) {
                return handleError(res, err);
              }
              return res.send(200, product);
            });
        });

      });
    });

  });
};

// Adds a new revision to a product.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  delete req.body.__t;
  req.body.suppliers = mapSuppliers(req.body.suppliers);
  req.body.author = req.user._id;

  Product.findById(req.params.id, function(err, product) {
    if (err) { return handleError(res, err); }
    if(!product) { return res.send(404); }
    ProductRevision.create(req.body, function(err, revision) {
      if (err) {
        return handleError(res, err);
      }
      product.awaitingModeration = true;
      product._revisions.push(revision._id);
      product.save(function(err, product) {
        if (err) {
          return handleError(res, err);
        }
        mandrill_client.messages.send({
          message: {
            html: jade.renderFile(path.resolve(__dirname, 'emails/new-revision.jade'), {
              url: process.env.DOMAIN + '/products/' + req.params.id + '?edit',
              revision: revision._id
            }),
            subject: 'New Product Revision',
            from_email: 'no-reply@speechbubble.org.uk',
            from_name: 'SpeechBubble Admin',
            to: [{
              email: process.env.SUPPORT_EMAIL,
              name: 'SpeechBubble Admin',
              type: 'to'
            }],
            auto_text: true
          }
        }, function(result) {
          res.send(200, product);
        });
      });
    });
  });
};

// Deletes a product from the DB.
exports.destroy = function(req, res) {
  Product.findById(req.params.id, function (err, product) {
    if(err) { return handleError(res, err); }
    if(!product) { return res.send(404); }
    product.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// lists product images
exports.listImages = function(req, res) {
  var id = req.params.productId;
  var uploadDir = process.env.UPLOAD_DIR;
  var dir = path.resolve(uploadDir, 'products', id);
  fs.readdir(dir, function(err, files) {
    if(err) { return res.send(404); }
    res.json(_.map(files, function(file) {
      return { image: '/assets/images/uploads/products/' + id + '/' + file, name: file };
    }));
  });
};

exports.deleteImage = function(req, res) {
  var id = req.params.productId;
  var imageId = req.params.imageId;

  Product.findById(id, function(err, product) {
    if (err) {
      return handleError(res, err);
    }
    if (!product) {
      return res.send(404);
    }

    var image = product.images.id(imageId);

    if(!image) {
      return res.send(200, product.images);
    }

    var imageSrc = image.url.split('/');
    var filename = imageSrc[imageSrc.length -1];

    product.images.pull(imageId);

    product.save(function(err, product) {
      if (err) {
        return handleError(res, err);
      }
      var file = process.env.UPLOAD_DIR + '/products/' + id + '/' + filename;
      fs.unlink(file, function(err) {
        if (err && err.code !== 'ENOENT') {
          return handleError(res, err);
        }
        return res.send(200, product.images);
      });
    });
  });
};

// Get product revisions for current user
exports.revisions = function(req, res) {
  Product
    .findById(req.params.id)
    .populate({
      path: '_revisions',
      options: {
        sort: {createdAt: 'desc'}
      }
    })
    .lean()
    .exec(function(err, product) {
      if (err) {
        return handleError(res, err);
      }
      if (!product) {
        return res.send(404);
      }
      Product.populate(product, { path: '_revisions.suppliers', model: 'Supplier' }, function(err, product) {
        Product.populate(product, {
          path: '_revisions.author',
          select: 'firstName lastName',
          model: 'User'
        }, function(err, product) {
          if (err) {
            return handleError(res, err);
          }
          return res.send(200, product._revisions);
        });
      });
    });
};

// Adds images to product
exports.addImages = function(req, res) {
  var id = req.params.productId;
  var form = new formidable.IncomingForm();

  Product.findById(id, function (err, product) {
    if (err) {
      return handleError(res, err);
    }
    if (!product) {
      return res.send(404);
    }

    var dir = process.env.UPLOAD_DIR + '/products/' + id;

    fs.mkdir(process.env.UPLOAD_DIR + '/products/' + id, function(err) {
      // Handle error unless directory exists
      if (err && err.code !== 'EEXIST') {
        return handleError(res, err);
      }

      form.uploadDir = dir;
      form.keepExtensions = true;
      form.parse(req, function(err, fields, files) {
        if(err) { return handleError(res, err); }
        var filename = files.file.path.split('/').pop();
        var url = '/assets/images/uploads/products/' + id + '/' + filename;

        product.images.push({
          url: url,
          summary: 'Product image'
        });

        product.save(function(err) {
          if(err) { return handleError(res, err); }
          res.send(200, product.images);
        });
      });
    });

  });

};

exports.getSoftwareForVocabulary = function(req, res) {
  console.log(typeof req.query.vocabulary);
  Product.find({ 'features.premadeVocabulariesAvailable._id': req.query.vocabulary }, function(err, products) {
    if(err) { return handleError(res, err); }
    return res.send(200, products);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
