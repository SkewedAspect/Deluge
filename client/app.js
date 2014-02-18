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
        'directive.g+signin',

        'ui.ngTags',
        'client.templates',

        'deluge.filters',
        'deluge.directives',
        'deluge.services',
        'deluge.controllers'
    ])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider)
    {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/admin/:section?', { templateUrl: '/components/admin/partials/dashboard.html',  controller: 'AdminController'})
            .when('/admin/:section/:slug*?', { templateUrl: '/components/admin/partials/dashboard.html',  controller: 'AdminController'})
            .when('/articles/:slug', { templateUrl: '/components/articles/partials/articles.html',   controller: 'ArticlesController'})
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
    .run(['$rootScope', '$location', '$http', '$socket', function($rootScope, $location, $http, $socket)
    {
        $rootScope.user = undefined;

        //--------------------------------------------------------------------------------------------------------------
        // Useful functions
        //--------------------------------------------------------------------------------------------------------------

        $rootScope.setLocation = function(path)
        {
            $location.path(path);
        }; // end setLocation

        //--------------------------------------------------------------------------------------------------------------
        // Authentication
        //--------------------------------------------------------------------------------------------------------------

        $rootScope.$on('event:google-plus-signin-success', function (event, authResult)
        {
            $http.post('/auth/google/callback', { code: authResult.code })
                .success(function(data)
                {
                    $rootScope.user = data.user;
                });
        });

        $rootScope.$on('event:google-plus-signin-failure', function (event, authResult)
        {
            // Auth failure or signout detected
            console.log('signin failure:', authResult);
        });

        //--------------------------------------------------------------------------------------------------------------

        $socket.connect();
    }]);
//----------------------------------------------------------------------------------------------------------------------
