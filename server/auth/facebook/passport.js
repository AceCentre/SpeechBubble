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

          user.save(function(err, user) {
            if(!err) {
              return done(null, user);
            }
            User.findOne({
              email: profile.emails[0].value
            }, function(err, user) {
              if(err) { return done(err); }
              return done(null, user);
            });
          });

        } else {
          return done(null, user);
        }
      });
    }
  ));
};
