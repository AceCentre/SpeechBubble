'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Page = require('./page.model');
var User = require('../user/user.model');
var jade = require('jade');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_API_KEY);
var path = require('path');

exports.show = function(req, res) {
  Page
  .findOne({
    slug: req.params.slug,
    visible: true
  })
  .lean()
  .exec(function(err, page) {
    if(err) { return handleError(res, err); }
    if(!page) { return res.send(404); }
    return res.send(200, page);
  });
};

// Publishes a page revision
exports.publish = function(req, res) {
  var pageId = req.params.id;
  var revisionId = req.params.revision;

  Page
  .findById(pageId)
  .exec(function(err, page) {
    if (err) {
      return handleError(res, err);
    }
    if (!page) {
      return res.send(404);
    }
    var revision = page.revisions.id(revisionId);

    if (!revision) {
      return res.send(404);
    }

    var newPageData = _.omit(revision.toObject(), ['_id', 'createdAt', 'updatedAt']);

    page = _.extend(page, newPageData, { currentRevision: revisionId, visible: true });

    page.save(function(err, numberAffected, raw) {
      if (err) {
        return handleError(res, err);
      }
      mandrill_client.messages.send({
        message: {
          html: jade.renderFile(path.resolve(__dirname, 'emails/revision-published.jade'), {
            url: process.env.DOMAIN + '/' + page.slug,
            revision: revisionId
          }),
          subject: 'New Page Revision Published',
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
        return res.send(200, page);
      });
    });
  });
};

exports.create = function(req, res) {
  Page.create({ slug: req.body.slug, note: req.body.note }, function(err, page) {
    if(err) { return handleError(res, err); }
    return res.send(200, page);
  });
};

// Adds a new revision to a page.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }

  Page.findById(req.params.id, function(err, page) {
    if (err) { return handleError(res, err); }
    if(!page) { return res.send(404); }
    
    page.revisions.push({
      title: req.body.title,
      content: req.body.content,
      slug: req.body.slug,
      comments: req.body.comments,
      note: req.body.note,
      author: req.user._id
    });

    page.save(function(err, product) {
      if (err) {
        return handleError(res, err);
      }
      mandrill_client.messages.send({
        message: {
          html: jade.renderFile(path.resolve(__dirname, 'emails/new-revision.jade'), {
            url: process.env.DOMAIN + '/' + page.slug,
            revision: page.revisions[0]._id
          }),
          subject: 'New Page Revision',
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
        res.send(200, page);
      });
    });
  });
};

exports.list = function(req, res) {
  Page
  .find()
  .sort({ slug: 'asc' })
  .exec(function(err, pages) {
    if(err) { return handleError(res, err); }
    res.send(200, pages);
  });
};

exports.destroy = function(req, res) {
  Page.findById(req.params.id, function(err, page) {
    if(err) { return handleError(res, err); }
    if(!page) { return res.send(404); }
    page.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

// Get page revisions
exports.revisions = function(req, res) {
  Page
    .findById(req.params.id)
    .lean()
    .exec(function(err, page) {
      if (err) {
        return handleError(res, err);
      }
      if (!page) {
        return res.send(404);
      }
      Page.populate(page, {
        path: 'revisions.author',
        select: 'firstName lastName',
        model: 'User'
      }, function(err, page) {
        if (err) {
          return handleError(res, err);
        }
        return res.send(200, page.revisions);
      });
    });
};

function handleError(res, err) {
  return res.send(500, err);
}
