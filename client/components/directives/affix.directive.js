'use strict';

angular.module('speechBubbleApp')
.directive('affix', function() {
  return function(scope, element, attrs) {
	var $el = $(element);
	$el.affix({
		'offset': {
			'top': attrs.top || $el.offset().top,
			'bottom': attrs.bottom || 10
		}
	});
  };
});
