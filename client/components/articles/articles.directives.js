// ---------------------------------------------------------------------------------------------------------------------
// Collection of directives for working with Articles
//
// @module articles.directives.js
// ---------------------------------------------------------------------------------------------------------------------

function sortByDate(array)
{
    return array.sort(function(a, b) {
        a = new Date(a.date);
        b = new Date(b.date);
        return a < b ? -1 : a > b ? 1 : 0;
    }).reverse();
} // end sortByDate

// ---------------------------------------------------------------------------------------------------------------------

function recentArticlesDirective()
{
    return {
        restrict: 'E',
        scope: {
            drafts: '&includeDrafts',
            featured: '&includeFeatured',
            featuredOnly: '&',
            limit: '&',
            tags: '&'
        },
        templateUrl: '/components/articles/partials/recent.html',
        controller: function($scope, $socket)
        {
            var filter = { featured: (!!$scope.featuredOnly() || !!$scope.featured()), draft: !!$scope.drafts() };
            if($scope.featured())
            {
                filter = { draft: !!$scope.drafts() };
            } // end if

            var tags = [];
            if(typeof $scope.tags() == 'string')
            {
                tags.push($scope.tags());
            }
            else
            {
                tags = $scope.tags();
            } // end if

            $socket.emit('find articles', filter, tags, function(error, articles)
            {
                if(error)
                {
                    console.log('Error:', error);
                }
                else
                {
                    var limit = ($scope.limit() || articles.length);

                    articles = sortByDate(articles);
                    $scope.articles = articles.splice(0, limit);
                } // end if
            });
        }
    }
}

// ---------------------------------------------------------------------------------------------------------------------

function listArticlesDirective()
{
    return {
        restrict: 'E',
        scope: {
            drafts: '&includeDrafts',
            featured: '&includeFeatured',
            itemsPerPage: '&',
            tags: '&'
        },
        templateUrl: '/components/articles/partials/list.html',
        controller: function($scope, $socket)
        {
            var filter = { featured: !!$scope.featured(), draft: !!$scope.drafts() };
            if($scope.featured() == undefined || $scope.featured())
            {
                filter = { draft: !!$scope.drafts() };
            } // end if

            $scope.shouldDisplay = function(index)
            {
                var perPage = ($scope.itemsPerPage() || 10);
                var startIdx = (($scope.curPage || 1) - 1) * perPage;
                var endIdx = startIdx + perPage;

                if(index >= startIdx && index < endIdx)
                {
                    return true;
                } // end if

                return false;
            };

            var tags = [];
            if(typeof $scope.tags() == 'string')
            {
                tags.push($scope.tags());
            }
            else
            {
                tags = $scope.tags();
            } // end if

            $socket.emit('find articles', filter, tags, function(error, articles)
            {
                if(error)
                {
                    console.log('Error:', error);
                }
                else
                {
                    $scope.articles = articles;
                } // end if
            });
        }
    }
} // end listArticlesDirective

//----------------------------------------------------------------------------------------------------------------------

angular.module('deluge.directives').directive('recentArticles', recentArticlesDirective);
angular.module('deluge.directives').directive('listArticles', listArticlesDirective);

// ---------------------------------------------------------------------------------------------------------------------