'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Page = require('./page.model');
var PageRevision = require('./page-revision.model');

exports.show = function(req, res) {
  Page
  .findOne({
    slug: req.params.slug,
    visible: true
  })
  .populate({
      path: '_revisions',
      match: { published: true },
      options: { limit: 1, sort: { createdAt: 'desc' } }
  })
  .lean()
  .exec(function(err, page) {
    if(err) { return handleError(res, err); }
    if(!page) { return res.send(404); }
    if(!page._revisions.length) { return res.send(404); }
    page.revision = page._revisions[0];
    delete page._revisions;
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
      published: req.body.published,
      content: req.body.content,
      author: req.user._id,
    }, function(err, revision) {
      if(err) { return handleError(res, err); }

      // update page properties
      page.visible = req.body.visible;
      page.slug = req.body.slug;
      page.comments = req.body.comments;

      // push revision to page history
      page._revisions.push( revision._id );

      page.save(function(err, page) {
        if(err) { return handleError(res, err); }
        page.populate('_revisions', function(err, page) {
          return res.send(200, page);
        });
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
  Page.findById(req.params.id, function(err, page) {
    if(err) { return handleError(res, err); }
    if(!page) { return res.send(404); }
    PageRevision.remove({ _id: { $in: page._revisions } }, function(err) {
      if(err) { return handleError(res, err); }
      page.remove();
    });
    res.send(204);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
