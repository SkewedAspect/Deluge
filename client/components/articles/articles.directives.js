// ---------------------------------------------------------------------------------------------------------------------
// Collection of directives for working with Articles
//
// @module articles.directives.js
// ---------------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------------------------

module.directive('featuredArticles', function()
{
    return {
        restrict: 'EA',
        templateUrl: '/components/articles/partials/featured.html',
        controller: function()
        {

        }
    }
});
// ---------------------------------------------------------------------------------------------------------------------

module.directive('recentArticles', function()
{
    return {
        restrict: 'EA',
        templateUrl: '/components/articles/partials/recent.html',
        controller: function()
        {

        }
    }
});
// ---------------------------------------------------------------------------------------------------------------------

module.directive('listArticles', function()
{
    return {
        restrict: 'EA',
        templateUrl: '/components/articles/partials/list.html',
        controller: function()
        {

        }
    }
});

// ---------------------------------------------------------------------------------------------------------------------