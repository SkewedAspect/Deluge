//----------------------------------------------------------------------------------------------------------------------
// Main deluge angular application
//
// @module app.js
//----------------------------------------------------------------------------------------------------------------------

window.app = angular.module("deluge", [
        'ngRoute',
        'ngResource',
        'ui.bootstrap',
        'client.templates',
        'components.filters',
        'components.controllers'
    ])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider)
    {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/admin/:section?/:slug*?', { templateUrl: '/components/admin/partials/dashboard.html',  controller: 'AdminController'})
            .when('/:slug*?', { templateUrl: '/components/pages/partials/pages.html',   controller: 'PagesController'})
            .otherwise({redirectTo: '/'});

        // Configure marked parser
        marked.setOptions({
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false
        });

    }])
    .run(['$rootScope', '$location', function($rootScope, $location)
    {
        //--------------------------------------------------------------------------------------------------------------
        // Useful functions
        //--------------------------------------------------------------------------------------------------------------

        $rootScope.setLocation = function(path)
        {
            $location.path(path);
        }; // end setLocation

        //--------------------------------------------------------------------------------------------------------------

        // Connect to socket.io
        $rootScope.socket = io.connect();
    }]);
//----------------------------------------------------------------------------------------------------------------------
