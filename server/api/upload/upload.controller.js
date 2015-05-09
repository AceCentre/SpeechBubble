'use strict';

var _ = require('lodash');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

// Get list of uploads
exports.index = function(req, res) {
  fs.readdir(process.env.UPLOAD_DIR, function(err, files) {
    if(err) { return handleError(res, err); }
    res.json(
      _
      .filter(files, function(file) {
        return file.indexOf('.') > -1;
      })
      .map(function(file) {
        return {
          image: '/assets/images/uploads/' + file,
          name: file
        };
      })
    );
  });
};

// Creates a new upload in the DB.
exports.create = function(req, res) {
  var form = new formidable.IncomingForm();
  form.uploadDir = process.env.UPLOAD_DIR;
  form.keepExtensions = true;
  form.parse(req, function(err, fields, files) {
    if(err) { return handleError(res, err); }
    var filename = files.file.path.split('/').pop();
    res.send(200, {
      image: '/assets/images/uploads/' + filename,
      name: filename
    });
  });
};

// Deletes a upload from the DB.
exports.destroy = function(req, res) {
  var file = path.resolve(process.env.UPLOAD_DIR, req.params.filename);

  fs.exists(file, function(yes) {
    if(yes) {
      fs.unlink(file, function(err) {
        console.log(err);
        if(err) { return handleError(res, err); }
        res.send(200);
      });
    } else {
      res.send(404);
    }
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
