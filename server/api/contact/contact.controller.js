'use strict';

var nodemailer = require('nodemailer');
var htmlToText = require('html-to-text');
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

  // nodemailer transport
  var transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
       user: process.env.EMAIL_EMAILADDRESS,
       pass: process.env.EMAIL_EMAILPASSWORD
    }
   });

  request({ url: captchaUrl, json: true }, function(captchaErr, captchaRes, captchaBody) {
    if(captchaBody.success) {
      var mailOptions = {
          from: '"' + firstName + '" ' + lastName + '<'+email+'>',
          to: '"SpeechBubble Admin"' + '<'+ process.env.SUPPORT_EMAIL +'>',
          subject: 'SpeechBubble Contact Form',
          text: htmlToText.fromString(jade.renderFile(path.resolve(__dirname, 'emails/admin.jade')),
          html: jade.renderFile(path.resolve(__dirname, 'emails/admin.jade'), {
      };
      transporter.sendMail(mailOptions, function(error, info){
          if(error){
              res.send(400, error);
          }
          res.send(200);
      });
    }
  });
};
