'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Page = require('./page.model');
var PageRevision = require('./page-revision.model');

exports.show = function(req, res) {
  Page
  .findOne({
    slug: req.params.slug,
    published: true
  })
  .populate({
      path: '_revisions',
      match: { status: 'published' },
      options: { limit: 1 }
  })
  .exec(function(err, page) {
    if(err) { return handleError(res, err); }
    if(!page) { return res.send(404); }
    return res.send(200, page);
  });
};

exports.create = function(req, res) {
  Page.create({ slug: req.body.slug }, function(err, page) {
    if(err) { return handleError(res, err); }
    return res.send(200, page);
  });
};

exports.update = function(req, res) {
  Page.findById(req.params.id, function(err, page) {
    if(err) { return handleError(res, err); }
    if(!page) { return res.send(404); }
    PageRevision.create(req.body, function(err, revision) {
      if(err) { return handleError(res, err); }
      page._revisions.push( revision._id );
      res.send(200, page);
    });
  });
};

exports.list = function(req, res) {
  Page
  .find()
  .populate('_revisions')
  .exec(function(err, pages) {
    if(err) { return handleError(res, err); }
    res.send(200, pages);
  });
};

exports.destroy = function(req, res) {
  Page.findByIdAndRemove(req.params.id, function(err) {
    if(err) { return handleError(res, err); }
    res.send(204);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
