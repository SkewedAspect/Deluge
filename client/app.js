//----------------------------------------------------------------------------------------------------------------------
// Main deluge angular application
//
// @module app.js
//----------------------------------------------------------------------------------------------------------------------

window.app = angular.module("deluge", [
        'ngRoute',
        'ngResource',
        'client.templates',
        'components.filters',
        'components.controllers'
    ])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider)
    {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/admin', { templateUrl: '/components/admin/partials/dashboard.html',  controller: 'AdminController'})
            .when('/:slug*?', { templateUrl: '/components/pages/partials/pages.html',   controller: 'PagesController'})
            .otherwise({redirectTo: '/'});
    }]);
//----------------------------------------------------------------------------------------------------------------------
