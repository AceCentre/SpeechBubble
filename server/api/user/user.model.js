'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var authTypes = ['twitter', 'facebook', 'google'];
var MailChimpAPI = require('mailchimp').MailChimpAPI;
var uuid = require('node-uuid');

var UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: String,
  description: {
    type: String,
    enum: ['', 'professional', 'parent', 'aac user', 'other']
  },
  region: {
    type: String,
    enum: ['', 'UK', 'Europe', 'USA', 'other']
  },
  email: {
    type: String,
    lowercase: true,
    unique: true
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
      return uuid.v4()
    }
  },
  // site privacy/cookie policy
  accept: {
    type: Boolean,
    default: false
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
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
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
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Invalid password'));
    else
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
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

// Update MailChimp Subscription on save
UserSchema.post('save', function(doc) {
  try {
    var api = new MailChimpAPI(process.env.MAILCHIMP_API_KEY, { version : '2.0' });
  } catch (err) {
    console.log(err);
    return;
  }
  if(doc.subscribe) {
    api.lists_subscribe({
      id: process.env.MAILCHIMP_LIST_ID,
      update_existing: true,
      email: {
        email: doc.email
      },
      merge_vars: {
        FNAME: doc.firstName,
        LNAME: doc.lastName
      }
    }, function(err, data) {
      if(!err) {
        console.log('subscribed: ' + doc.email);
      }
    });
  } else {
    api.lists_unsubscribe({
      id: process.env.MAILCHIMP_LIST_ID,
      email: {
        email: doc.email
      }
    }, function(err, data) {
      if(!err) {
        console.log('unsubscribed: ' + doc.email);
      }
    });
  }
});

module.exports = mongoose.model('User', UserSchema);
