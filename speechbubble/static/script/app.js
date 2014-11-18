var app = angular
    .module('speechBubble', ["checklist-model", "ui.bootstrap", 'angular-flash.service', 'angular-flash.flash-alert-directive', 'dialogs.main', 'pascalprecht.translate'])
    .config(['flashProvider', function (flashProvider) {
        flashProvider.errorClassnames.push('alert-danger');
    }]);