'use strict';

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_API_KEY);
var path = require('path');
var jade = require('jade');
var request = require('request');

// Get list of contacts
exports.send = function(req, res) {
  var userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var firstName = req.body.firstName || '';
  var lastName = req.body.lastName || '';
  var email = req.body.email || '';
  var message = req.body.body || '';

  var captchaUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=' + process.env.CAPTCHA_API_KEY + '&response=' + req.body.captcha + '&remoteip=' + userIp;

  request({ url: captchaUrl, json: true }, function(captchaErr, captchaRes, captchaBody) {
    if(captchaBody.success) {
      mandrill_client.messages.send({
        message: {
          html: jade.renderFile(path.resolve(__dirname, 'emails/admin.jade'), {
            firstName: firstName,
            lastName: lastName,
            email: email,
            message: message
          }),
          subject: 'Speech Bubble Contact Form',
          from_email: email,
          from_name: firstName + ' ' + lastName,
          to: [{
            email: process.env.SUPPORT_EMAIL,
            name: 'Speech Bubble Admin',
            type: 'to'
          }],
          auto_text: true
        }
      }, function(result) {
        if(res.reject_reason) {
          res.send(400, result.reject_reason);
        } else {
          res.send(200);
        }
      });
    }
  });
};
