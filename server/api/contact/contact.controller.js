'use strict';

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_API_KEY);
var path = require('path');
var jade = require('jade');

// Get list of contacts
exports.send = function(req, res) {
  mandrill_client.messages.send({
    message: {
      html: jade.renderFile(path.resolve(__dirname, 'emails/admin.jade'), {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        message: req.body.body
      }),
      subject: 'Speech Bubble Contact Form',
      from_email: req.body.email,
      from_name: req.body.firstName + ' ' + req.body.lastName,
      to: [{
        email: process.env.SUPPORT_EMAIL,
        name: 'Speech Bubble Admin',
        type: 'to'
      }],
      auto_text: true
    }
  }, function(result) {
    if(res.reject_reason) {
      res.send(500, result.reject_reason);
    } else {
      res.send(200);
    }
  });
};
