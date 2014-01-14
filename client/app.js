//----------------------------------------------------------------------------------------------------------------------
// Main deluge angular application
//
// @module app.js
//----------------------------------------------------------------------------------------------------------------------

window.app = angular.module("deluge", [
        'ngRoute',
        'ngResource',
        'slugifier',
        'ui.bootstrap',
        'ui.codemirror',
        'client.templates',
        'components.filters',
        'components.controllers'
    ])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider)
    {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/admin/:section?', { templateUrl: '/components/admin/partials/dashboard.html',  controller: 'AdminController'})
            .when('/admin/:section/:slug*?', { templateUrl: '/components/admin/partials/dashboard.html',  controller: 'AdminController'})
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
            smartypants: false,
            highlight: function (code) {
                return hljs.highlightAuto(code).value;
            }
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
