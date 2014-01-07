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
        /*
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/dashboard', {templateUrl: '/partials/dashboard.html',   controller: 'DashboardCtrl'})
            .when('/character/:id', {templateUrl: '/partials/character.html',   controller: 'CharacterCtrl'})
            .otherwise({redirectTo: '/dashboard'});
        */
    }]);
//----------------------------------------------------------------------------------------------------------------------
