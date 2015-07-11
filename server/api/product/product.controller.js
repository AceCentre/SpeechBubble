'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var jade = require('jade');
var Product = require('./product.model');
var formidable = require('formidable');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_API_KEY);
var User = require('../user/user.model');

function flatten(suppliers) {
  return _.uniq(suppliers.map(function(supplier) {
    return _.isString(supplier) ? supplier: supplier._id;
  }));
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

exports.similar = function(req, res) {
  var term = req.query.term;
  Product
  .find({ 'name': new RegExp(term, "i") })
  .limit(10)
  .exec(function(err, products) {
    if(err) { return handleError(res, err); }
    res.send(200, products.map(function(product) {
      return product.name;
    }));
  });
};

function returnProducts(req, res, err, products) {
  if(err) { return handleError(res, err); }
  if(!products) { return res.send(404); }
  res.send(200, {
    'items': products,
    'total': products.length
  });
}

function wizardAssociatedExistingDeviceQuery(req, res) {
  if(!req.query.selectedDevice) {
    return res.send(200, []);
  }
  Product
  .find({ '_id': req.query.selectedDevice })
  .exec(function(err, products) {
    // Get associated software and vocabularies
    if(err) { return handleError(res, err); }
    if(!products) { return res.send(404); }

    var or = getAssociatedOrQuery(req, products);

    Product
    .find()
    .or(or)
    .exec(function(err, associated) {
      returnProducts(req, res, err, associated);
    });
  });
}

function getAssociatedOrQuery(req, products) {
  var associatedSoftware = products.reduce(function(memo, current) {
    if(current.features && current.features.associatedSoftware) {
      return memo.concat(current.features.associatedSoftware.map(function(item) {
        return item._id;
      }));
    }
    return memo;
  }, []);

  var associatedVocabulary = products.reduce(function(memo, current) {
    if(current.features && current.features.premadeVocabulariesAvailable) {
      return memo.concat(current.features.premadeVocabulariesAvailable.map(function(item) {
        return item._id;
      }));
    }
    return memo;
  }, []);

  var acceptableFacets = {
    'vocabulary': [
      'presentation-text-only',
      'presentation-text-and-symbols-or-photos',
      'presentation-symbols-or-photos',
      'presentation-visual-scenes'
    ]
  };

  var or = [];

  // we have facets containing acceptable for vocabulary
  var facets = _.isString(req.query.facets) ? [req.query.facets]: req.query.facets;

  if(req.query.facets && _.intersection(facets, acceptableFacets.vocabulary).length) {
    or.push({ '_id': {
      '$in': associatedVocabulary },
      'facets': { '$in': facets }
    });
  } else {
    or.push({ '_id': { '$in': associatedVocabulary } });
  }

  or.push({ '_id': { '$in': associatedSoftware } });

  return or;
}

function wizardAssociatedPhysicalQuery(req, res) {
  var qb = new QueryBuilder();
  var facets = [];

  if(req.query.facets) {
    facets = _.isString(req.query.facets) ? [req.query.facets]: req.query.facets;
  }

  if(facets.length) {
    qb.add('type', 'ProductHardware');
    qb.add('facets', { '$in': facets });
  }

  Product
  .find(qb.query)
  .exec(function(err, products) {
    if(err) { return handleError(res, err); }
    if(!products) { return res.send(404); }

    if(facets.indexOf('premade-vocabularies') > -1) {
      products = products.filter(function(p) {
        return p.facets.indexOf('premade-vocabularies') > -1;
      });
      console.log(products.length);
    }

    var or = getAssociatedOrQuery(req, products);

    Product
    .find()
    .where('type').ne('ProductHardware')
    .or(or)
    .exec(function(err, associated) {
      if(err) { return handleError(res, err); }
      if(!associated) { return res.send(404); }
      var results = associated.concat(products);
      return res.send(200, {
        'items': results,
        'total': results.length
      });
    });
  });
}

function QueryBuilder() {
  this.query = {};
}

QueryBuilder.prototype.add = function(key, value, defaultValue) {
  var value = value || defaultValue;
  if(!key) {
    return;
  }
  if(value) {
    return this.query[key] = value;
  }
};

// Get list of products
exports.index = function(req, res) {
  var page = req.query.page || 1;
  var limit = req.query.limit || 10;
  var skip = (page - 1) * limit;

  // Search Wizard Existing Device
  if(req.query.existingDevice === 'true') {
    return wizardAssociatedExistingDeviceQuery(req, res, qb);
  }

  // Search Wizard Physical
  if(req.query.physicalDevice === 'true' || req.query.existingDevice === 'false') {
    return wizardAssociatedPhysicalQuery(req, res, qb);
  }

  var qb = new QueryBuilder();

  if(req.query.term) {
    qb.add('$text', { '$search': req.query.term })
  }

  // Hide access solutions by default
  if(req.query.type) {
    qb.add('type', req.query.type);
  } else {
    qb.add('type', { $not: { $eq: 'ProductAccessSolution' } });
  }

  // Hide vocabularies that are built into hardware by default
  var facets = req.query.facets;

  if(facets) {
    qb.add('facets', { '$in': _.isString(facets) ? [facets]: facets });
  } else {
    qb.add('facets', { '$not': { '$in': ['no-software-required'] } });
  }

  if(req.query.awaitingModeration === 'true') {
    qb.add('awaitingModeration', true);
  }

  // HARDWARE FILTERS
  if(req.query.type === 'ProductHardware') {
    if(req.query.batteryLife) {
      qb.add('batteryLife', { $gte: parseInt(req.query.batteryLife, 10) });
    }
    if(req.query.screenSize) {
      qb.add('screenSize', { $gte: parseInt(req.query.screenSize, 10) });
    }
  }

  // EXCEPT LOW TECH
  if(req.query.type !== 'ProductLowTech') {
    var devices = req.query.devices;
    if(devices) {
      qb.add('operatingSystems', { $in: _.isArray(devices) ? devices: [devices] });
    }
  }

  Product
  .find(qb.query)
  .count(function(err, total) {
    if(err) { return handleError(res, err); }
    Product
    .find(qb.query)
    .sort({
      'name': 'asc'
    })
    .skip(skip)
    .limit(limit)
    .populate('suppliers')
    .populate('revisions.suppliers')
    .populate('associatedSoftware')
    .populate('revisions.associatedSoftware')
    .populate({
      'path': 'revisions.author',
      'model': 'User',
      'select': 'firstName'
    })
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
  .findOne({ slug: req.params.slug })
  .populate('suppliers')
  .exec(function (err, product) {
    if(err) { return handleError(res, err); }
    if(!product) { return res.send(404); }
    if(req.user) {
      req.user.viewedProduct(product._id);
    }
    Product
    .populate(product, { path: 'revisions.author', model: 'User', select: 'firstName' }, function(err, product) {
      if(err) { return handleError(res, err); }
      if(!product) { return res.send(404); }
      return res.json(product);
    });
  });
};

// Get a single product revision
exports.showRevision = function(req, res) {
  Product
  .findOne({ slug: req.params.slug })
  .populate('suppliers')
  .exec(function (err, product) {
    if(err) { return handleError(res, err); }
    if(!product) { return res.send(404); }
    Product
    .populate(product, { path: 'revisions.author', model: 'User', select: 'firstName' }, function(err, product) {
      if(err) { return handleError(res, err); }
      if(!product) { return res.send(404); }
      // merge revision with product to get things
      // like revision history and ratings
      var revision = product.revisions.id(req.params.revisionId);
      var newProductData = _.omit(revision.toObject(), ['_id']);
      product = _.extend(product, newProductData);
      return res.json(product);
    });

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
    if(req.user) {
      req.user.draftProduct(product._id);
    }
    return res.json(201, product);
  });
};

// Adds a new revision to a product
exports.publish = function(req, res) {
  var productId = req.params.id;
  var revisionId = req.params.revisionId;

  Product
  .findById(productId)
  .exec(function(err, product) {
    if (err) {
      return handleError(res, err);
    }
    if (!product) {
      return res.send(404);
    }

    var revision = product.revisions.id(revisionId);
    revision.published = true;
    var newProductData = _.omit(revision.toObject(), ['_id', 'createdAt', 'updatedAt']);

    product = _.extend(product, newProductData, { currentRevision: revisionId });

    // If we are publishing the latest revision remove moderation flag
    if(_.last(product.revisions).get('_id').toString() === revisionId) {
      product.awaitingModeration = false;
    }

    product.save(function(err, product) {
      if (err) {
        return handleError(res, err);
      }
      mandrill_client.messages.send({
        message: {
          html: jade.renderFile(path.resolve(__dirname, 'emails/revision-published.jade'), {
            url: process.env.DOMAIN + '/products/' + product.slug,
            name: 'Admin',
            revision: revisionId,
            domain: process.env.DOMAIN
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
        Product.findById(productId, function(err, product) {
          Product.populate(product, { path: 'revisions.author', model: 'User', select: 'firstName lastName' }, function(err, product) {
            product.populate('suppliers', function(err, product) {
              if (err) {
                return handleError(res, err);
              }
              return res.send(200, product);
            });
          })

        });
      });
    });
  });
};

// Adds a new revision to a product.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  delete req.body.__t;
  req.body.suppliers = flatten(req.body.suppliers);
  req.body.author = req.user._id;

  if(req.body.associatedSoftware) {
    req.body.associatedSoftware = flatten(req.body.associatedSoftware);
  }

  Product.findById(req.params.id, function(err, product) {
    if (err) { return handleError(res, err); }
    if(!product) { return res.send(404); }

    var data = _.omit(req.body, ['createdAt', 'updatedAt', '_id']);

    product.revisions.push(data);

    product.save(function(err, product) {
      if (err) {
        return handleError(res, err);
      }
      product.awaitingModeration = true;
      product.save(function(err, product) {
        if (err) {
          return handleError(res, err);
        }
        if(req.user) {
          req.user.draftProduct(product._id);
        }
        mandrill_client.messages.send({
          message: {
            html: jade.renderFile(path.resolve(__dirname, 'emails/new-revision.jade'), {
              url: process.env.DOMAIN + '/products/' + product.slug + '?edit',
              name: 'Admin',
              revision: product.revisions[0]._id,
              domain: process.env.DOMAIN
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
          Product.populate(product, { path: 'revisions.author', model: 'User', select: 'firstName lastName' }, function(err, product) {
              if (err) {
                return handleError(res, err);
              }
              product.populate('suppliers', function(err, product) {
                if (err) {
                  return handleError(res, err);
                }
                res.send(200, product);
              });
            });

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

// Deletes a product revision from the DB.
exports.destroyRevision = function(req, res) {
  var revisionId = req.params.revisionId;
  Product.findById(req.params.id, function (err, product) {
    if(err) { return handleError(res, err); }
    if(!product) { return res.send(404); }
    product.revisions.id(revisionId).remove();
    product.save(function(err, product) {
      if(err) { return handleError(res, err); }
      if(!product) { return res.send(404); }
      return res.send(200);
    })
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
      path: 'revisions',
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
      Product.populate(product, { path: 'revisions.suppliers', model: 'Supplier' }, function(err, product) {
        Product.populate(product, {
          path: 'revisions.author',
          select: 'firstName lastName',
          model: 'User'
        }, function(err, product) {
          if (err) {
            return handleError(res, err);
          }
          return res.send(200, product.revisions);
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

exports.getSupportedForVocabulary = function(req, res) {
  Product.find({ type: 'ProductSoftware', 'features.premadeVocabulariesAvailable._id': req.query.vocabulary }, function(err, software) {
    if(err) { return handleError(res, err); }
    Product.find({ type: 'ProductHardware', 'features.premadeVocabulariesAvailable._id': req.query.vocabulary }, function(err, hardware) {
      if(err) { return handleError(res, err); }
      return res.send(200, {
        'software': software,
        'hardware': hardware
      });
    });
  });
};

exports.listHardware = function(req, res) {
  Product
  .find({ 'type': 'ProductHardware' })
  .select('name _id')
  .exec(function(err, products) {
    if(err) { return handleError(res, err); }
    res.send(200, products);
  })
};

exports.slugify = function(req, res) {
  console.log('rebuilding slugs');
  Product.find({}, function(err, products) {
    products.forEach(function(product) {
      product.slug = product.name.split(' ').join('-').toLowerCase();
      product.author = req.user._id;
      product.save();
    });
    res.send(200, 'Rebuilt slugs');
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
