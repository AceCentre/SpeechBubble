'use strict';

var _ = require('lodash');
var formidable = require('formidable');
var fs = require('fs');

// Get list of uploads
exports.index = function(req, res) {
  fs.readdir(process.env.UPLOAD_DIR, function(err, files) {
    if(err) { return handleError(res, err); }
    res.json(files);
  });
};

// Creates a new upload in the DB.
exports.create = function(req, res) {
  var form = new formidable.IncomingForm();
  form.uploadDir = process.env.UPLOAD_DIR;
  form.keepExtensions = true;
  form.parse(req, function(err, fields, files) {
    if(err) { return handleError(res, err); }
    res.send(200);
  });
};

// Deletes a upload from the DB.
exports.destroy = function(req, res) {

};

function handleError(res, err) {
  return res.send(500, err);
}
