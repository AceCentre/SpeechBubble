'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Page = require('./page.model');
var PageRevision = require('./page-revision.model');

exports.show = function(req, res) {
  Page
  .findOne({
    slug: req.params.slug,
    visibility: 'public'
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
  Page.findById(req.body._id, function(err, page) {
    if(err) { return handleError(res, err); }
    if(!page) { return res.send(404); }
    PageRevision.create({
      title: req.body.title,
      status: req.body.status,
      content: req.body.content
    }, function(err, revision) {
      if(err) { return handleError(res, err); }

      // update page properties
      page.visibility = req.body.visibility;
      page.slug = req.body.slug;
      page.comments = req.body.comments;
      page.registration = req.body.registration;

      // push revision to page history
      page._revisions.unshift( revision._id );

      page.save(function(err, page) {
        res.send(200, page);
      });
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
