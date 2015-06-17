'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var authTypes = ['twitter', 'facebook', 'google'];
var MailChimpAPI = require('mailchimp').MailChimpAPI;
var uuid = require('node-uuid');
var ENUM = require('../../enum');
var CryptoJS = require("crypto-js");

var UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: String,
  description: {
    type: String,
    enum: ENUM.USER_DESCRIPTION
  },
  region: {
    type: String,
    enum: ENUM.REGION
  },
  email: {
    type: String,
    lowercase: true,
    index: { unique: true, sparse: true }
  },
  subscribe: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: 'user'
  },
  active: {
    type: Boolean,
    default: false
  },
  activationCode: {
    type: String,
    default: function() {
      return uuid.v4();
    }
  },
  // site privacy/cookie policy
  accept: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  hashedPassword: String,
  provider: String,
  salt: String,
  facebook: {},
  twitter: {},
  google: {}
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role
    };
  });
  
UserSchema
  .virtual('disqus')
  .get(function() {
    var self = this;
    var disqusData = {
      id: self._id,
      username: self.email,
      email: self.email
    };

    var disqusStr = JSON.stringify(disqusData);
    var timestamp = Math.round(+new Date() / 1000);
    var message = new Buffer(disqusStr).toString('base64');
    var result = CryptoJS.HmacSHA1(message + " " + timestamp, process.env.DISQUS_SECRET);
    var hexsig = CryptoJS.enc.Hex.stringify(result);
    
    return {
      pubKey: process.env.DISQUS_PUBLIC,
      auth: message + " " + hexsig + " " + timestamp
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    if (authTypes.indexOf(this.provider) !== -1) { return true; }
    return email.length;
  }, 'Email cannot be blank');
 

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    if (authTypes.indexOf(this.provider) !== -1) { return true; }
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) { throw err; }
      if(user) {
        if(self.id === user.id) { return respond(true); }
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if (!this.isNew) { return next(); }

    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1) {
      next(new Error('Invalid password'));
    } else {
      next();
    }
  })
  .pre('save', function(next) {
    if(process.env.NODE_ENV === 'development') {
      return next();
    }
    // Update MailChimp Subscription on save
    var user = this;
    var api;

    try {
      api = new MailChimpAPI(process.env.MAILCHIMP_API_KEY, { version : '2.0' });
    } catch (err) {
      console.log(err);
      return;
    }
    if(user.subscribe) {
      api.lists_subscribe({
        id: process.env.MAILCHIMP_LIST_ID,
        update_existing: true,
        email: {
          email: user.email
        },
        merge_vars: {
          FNAME: user.firstName,
          LNAME: user.lastName
        }
      }, function(err, data) {
        if(!err) {
          console.log('subscribed: ' + user.email);
        }
      });
    } else if(!user.isNew) {

      api.lists_unsubscribe({
        id: process.env.MAILCHIMP_LIST_ID,
        email: {
          email: user.email
        }
      }, function(err, data) {
        if(!err) {
          console.log('unsubscribed: ' + user.email);
        }
      });
    }
    next();
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) { return ''; }
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('User', UserSchema);
