'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Page = require('./page.model');
var User = require('../user/user.model');
var PageRevision = require('./page-revision.model');
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
    .lean()
    .exec(function(err, page) {
      if (err) {
        return handleError(res, err);
      }
      if (!page) {
        return res.send(404);
      }
      PageRevision
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

          revision.revisions = page.revisions;
          revision.currentRevision = revisionId;
          revision.visible = true;

          Page.update({ _id: pageId }, revision, { overwrite: true, multi: false }, function(err, numberAffected, raw) {
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
  req.body.author = req.user._id;

  Page.findById(req.params.id, function(err, page) {
    if (err) { return handleError(res, err); }
    if(!page) { return res.send(404); }
    PageRevision.create(req.body, function(err, revision) {
      if (err) {
        return handleError(res, err);
      }
      page.note = page.note || 'Published page';
      page.slug = page.slug || 'slug'; // temporary fix for production migration

      page.revisions.push(revision._id);
      page.save(function(err, product) {
        if (err) {
          return handleError(res, err);
        }
        mandrill_client.messages.send({
          message: {
            html: jade.renderFile(path.resolve(__dirname, 'emails/new-revision.jade'), {
              url: process.env.DOMAIN + '/' + page.slug,
              revision: revision._id
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
  });
};

exports.list = function(req, res) {
  Page
  .find()
  .sort({ slug: 'asc' })
  //.populate('revisions')
  .exec(function(err, pages) {
    if(err) { return handleError(res, err); }
    res.send(200, pages);
    //PageRevision.populate(pages, {
    //  path: 'revisions.author',
    //  select: 'firstName lastName',
    //  model: User
    //}, function(err, result) {
    //  res.send(200, pages);
    //});
  });
};

exports.destroy = function(req, res) {
  Page.findById(req.params.id, function(err, page) {
    if(err) { return handleError(res, err); }
    if(!page) { return res.send(404); }
    PageRevision.remove({ _id: { $in: page.revisions } }, function(err) {
      if(err) { return handleError(res, err); }
      page.remove();
    });
    res.send(204);
  });
};

// Get page revisions
exports.revisions = function(req, res) {
  Page
    .findById(req.params.id)
    .populate({
      path: 'revisions',
      options: {
        sort: { createdAt: 'desc' }
      }
    })
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
