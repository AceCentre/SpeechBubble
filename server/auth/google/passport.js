var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

exports.setup = function (User, config) {
  passport.use(new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({
        'google.id': profile.id
      }, function(err, user) {
        if (!user) {
          user = new User({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            role: 'user',
            provider: 'google',
            google: profile._json
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
