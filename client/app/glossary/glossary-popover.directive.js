'use strict';

angular.module('speechBubbleApp')

.directive('glossary', function ($http, $compile) {
  return {
    'link': function(scope, element, attrs) {
      element.removeAttr('glossary');
      scope.description = 'loading...';
      $compile(element)(scope);

      function getGlossaryItem() {
        $http({
          'method': 'GET',
          'url': '/api/glossary/' + attrs.glossary
        })
        .success(function(res) {
          scope.description = res.description;
          element.trigger('click');
        })
        .error(function() {
          scope.description = 'could not find help text';
        });
        element.unbind('mouseenter', getGlossaryItem);
      }
      element.bind('mouseenter', getGlossaryItem);
    },
    'replace': true,
    'scope': {},
    'template': '<span class="glyphicon glyphicon-question-sign" tooltip-html-unsafe="{{ description }}" />'
  };
});
