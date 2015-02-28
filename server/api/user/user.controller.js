'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_API_KEY);
var path = require('path');
var jade = require('jade');
var request = require('request');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';

  var captchaUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=' + process.env.CAPTCHA_API_KEY + '&response=' + req.body.captcha + '&remoteip=' + userIp;

  request({ url: captchaUrl, json: true }, function(captchaErr, captchaRes, captchaBody) {

      if(captchaBody.success) {
        newUser.save(function(err, user) {
          if (err) return validationError(res, err);

          var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
          res.json({ token: token });

          mandrill_client.messages.send({
            message: {
              html: jade.renderFile(path.resolve(__dirname, 'emails/welcome.jade'), {
                user: user,
                activationUrl: process.env.DOMAIN + '/account/activate/' + user.activationCode
              }),
              subject: 'Welcome to Speech Bubble',
              from_email: process.env.SUPPORT_EMAIL,
              from_name: 'Speech Bubble',
              to: [{
                email: user.email,
                name: user.firstName + ' ' + user.lastName,
                type: 'to'
              }],
              auto_text: true
            }
          }, function(result) {
            console.log(result);
            if(result.reject_reason) {
              res.send(400, result.reject_reason);
            } else {
              res.send(200);
            }
          });

        });
      } else {
        return res.send(400, 'Re-captcha error, please verify again.');
      }

    }
  );

};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(!user.hashedPassword || user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Update my info
 */
exports.update = function(req, res, next) {
  var userId = req.user._id;
  User.findOneAndUpdate({
    _id: userId
  }, {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName || '',
    description: req.body.description || '',
    region: req.body.region || '',
    subscribe: req.body.subscribe
  }, function(err) {
    if (err) return validationError(res, err);
    res.send(200);
  });
};

/**
 * Admin update user info
 * restriction: 'admin'
 */
exports.adminUpdate = function(req, res, next) {
  User.findOneAndUpdate({
    _id: req.params.id
  }, {
    email: req.body.email,
    role: req.body.role,
    active: req.body.active,
    subscribe: req.body.subscribe
  }, function(err) {
    if (err) return validationError(res, err);
    res.send(200);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

/**
 * Email verification
 */
exports.activate = function(req, res, next) {
  User.findOne({
    activationCode: req.params.id
  }, function(err, user) {
    if (err) return next(err);
    if (!user) return res.send(400);
    user.active = true;
    res.send(200);
  });
}
