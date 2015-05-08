'use strict';

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

exports.setup = function (User, config) {
  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL,
      enableProof: true
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({
        'facebook.id': profile.id
      },
      function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          user = new User({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            role: 'user',
            provider: 'facebook',
            facebook: profile._json
          });

          user
          .saveAsync()
          .then(function(user) {
            return done(null, user);
          })
          .catch(function(err) {
            return done(err);
          });
        } else {
          return done(null, user);
        }
      });
    }
  ));
};
