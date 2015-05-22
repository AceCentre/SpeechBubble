'use strict';

var LRU = require("lru-cache");
var cache = LRU({ maxAge: 1000 * 60 * 5 });
var Twitter = require('twitter-node-client').Twitter;
var twitter = new Twitter({
  "consumerKey": process.env.TWITTER_CONSUMER_KEY,
  "consumerSecret": process.env.TWITTER_CONSUMER_SECRET,
  "accessToken": process.env.TWITTER_ACCESS_TOKEN,
  "accessTokenSecret": process.env.TWITTER_TOKEN_SECRET,
  "callBackUrl": process.env.TWITTER_CALLBACK_URL
});

exports.twitter = function(req, res) {
  var limit = req.query.limit || 10;
  if(cache.get('tweets')) {
    res.send(200, cache.get('tweets'));
  } else {
    twitter.getUserTimeline(
      { screen_name: 'acecentre', count: limit },
      function() {
        handleError(res, 'Could not fetch timeline');
      },
      function(tweets) {
        cache.set('tweets', JSON.parse(tweets));
        res.json(200, cache.get('tweets'));
      });
  }
};

function handleError(res, err) {
  return res.send(500, err);
}
