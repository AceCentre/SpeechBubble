'use strict';

/**
 * Based on http://wncit.com/blog/2009/04/parsing-out-links-from-the-twitter-api-response-with-regular-expressions/
 */
angular.module('speechBubbleApp')
  .filter('tweet', function() {
    return function(tweet) {
      return tweet
        .replace(/(\b(www\.|http\:\/\/)\S+\b)/g, "<a target='_blank' href='$1'>$1</a>")
        .replace(/\#(\w+)/g, "<a target='_blank' href='http://www.twitter.com/hashtag/$1'>#$1</a>")
        .replace(/\@(\w+)/g, "<a target='_blank' href='http://twitter.com/$1'>@$1</a>");
    };
  });
