'use strict';

angular.module('speechBubbleApp')

.directive('glossary', function ($http, $compile) {
  return {
    'link': function(scope, element, attrs) {
      function getGlossaryItem() {
        $http({
          'method': 'GET',
          'url': '/api/glossary/' + attrs.glossary
        })
        .success(function(res) {
          scope.description = res.description;
          element.removeAttr('glossary');
          $compile(element)(scope);
        });
        element.unbind('mouseenter', getGlossaryItem);
      }
      element.bind('mouseenter', getGlossaryItem);
    },
    'replace': true,
    'scope': {},
    'template': '<span class="glyphicon glyphicon-question-sign" tooltip-trigger="click" tooltip-html-unsafe="{{ description }}" />'
  };
});
