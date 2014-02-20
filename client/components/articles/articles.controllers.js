// ---------------------------------------------------------------------------------------------------------------------
// Controllers for the articles component.
//
// @module articles.controllers.js
// ---------------------------------------------------------------------------------------------------------------------

function buildArticleTemplateURL(templateName)
{
    return '/components/articles/partials/' + templateName + '.html'
} // end buildArticleTemplateURL

// ---------------------------------------------------------------------------------------------------------------------

function ArticlesController($scope, $routeParams)
{
    var not_found = {
        title: "Article not found",
        template: buildArticleTemplateURL('notfound')
    };

    var error_article = {
        title: "Article not found",
        template: buildArticleTemplateURL('error')
    };

    var slug = $routeParams.slug;

    // Attempt to get the article for the current slug.
    $scope.socket.emit('get article', slug, function(error, article)
    {
        $scope.$apply(function()
        {
            if(error)
            {
                console.log('Error getting article.', error);
                $scope.article = error_article;
                $scope.article.slug = slug;
                $scope.article.error = error;
            }
            else
            {
                $scope.article = article || not_found;
                $scope.article.slug = slug;
            } // end if
        });
    });
} // end ArticlesController

//----------------------------------------------------------------------------------------------------------------------

angular.module('deluge.controllers').controller('ArticlesController', ['$scope', '$routeParams', ArticlesController]);

// ---------------------------------------------------------------------------------------------------------------------