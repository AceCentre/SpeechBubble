'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var Product = require('./product.model');
var ProductRevision = require('./product-revision.model');
var formidable = require('formidable');

// Get list of products
exports.index = function(req, res) {
  var skip = req.query.skip || 0;
  var limit = req.query.limit || 10;
  var type = req.query.type;
  var term = req.query.term;

  var orQuery;
  var query = {};

  if(term) {
    var re = new RegExp(term, 'i');
    orQuery = [
      { name: re },
      { description: re }
    ];
  }

  if(type) {
    query.type = type;
  }

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
  if(Array.isArray(req.body.suppliers)) {
    req.body.suppliers = req.body.suppliers.map(function(supplier) {
      return _.isString(supplier) ? supplier: supplier._id;
    });
  }

  Product.create(req.body, function(err, product) {
    if(err) { return handleError(res, err); }
    return res.json(201, product);
  });
};

// Updates an existing product in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }

  req.body.suppliers = req.body.suppliers.map(function(supplier) {
    return _.isString(supplier) ? supplier: supplier._id;
  });

  Product.findById(req.params.id, function(err, product) {
    if (err) { return handleError(res, err); }
    if(!product) { return res.send(404); }
    ProductRevision.create(req.body, function(err, revision) {
      if (err) {
        return handleError(res, err);
      }
      product._revisions.push(revision._id);

      if(req.user.role === 'admin' && req.body.publish) {
        product.update(req.body, function(err, product) {
          if (err) {
            return handleError(res, err);
          }
          res.send(200, product);
        });
      } else {
        product.save(function(err, product) {
          if (err) {
            return handleError(res, err);
          }
          res.send(200, product);
        });
      }
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
    .populate('_revisions')
    .lean()
    .exec(function(err, product) {
      if (err) {
        return handleError(res, err);
      }
      if (!product) {
        return res.send(404);
      }
      return res.send(200, product._revisions);
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

function handleError(res, err) {
  return res.send(500, err);
}
