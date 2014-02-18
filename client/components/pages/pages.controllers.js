// ---------------------------------------------------------------------------------------------------------------------
// Controllers for the pages component.
//
// @module pages.controllers.js
// ---------------------------------------------------------------------------------------------------------------------

function buildTemplateURL(templateName)
{
    return '/components/pages/partials/' + templateName + '.html'
} // end buildTemplateURL

// ---------------------------------------------------------------------------------------------------------------------

function PagesController($scope, $routeParams, $location)
{
    var not_found = {
        title: "Page not found",
        template: buildTemplateURL('notfound')
    };

    var error_page = {
        title: "Page not found",
        template: buildTemplateURL('error')
    };

    var fallback_page = {
        title: "Deluge Welcome Page",
        template: buildTemplateURL('fallback')
    };

    // Detect a lack of pages, and display a friendly page.
    $scope.socket.emit('has pages', function(error, hasPages)
    {
        var slug = $routeParams.slug || '/';

        if(!hasPages)
        {
            $scope.$apply(function()
            {
                if(slug != '/')
                {
                    $location.path('/');
                }
                else
                {
                    $scope.page = fallback_page;
                } // end if
            });
        }
        else
        {
            // Attempt to get the page for the current slug.
            $scope.socket.emit('get page', slug, function(error, page)
            {
                $scope.$apply(function()
                {
                    if(error)
                    {
                        console.log('Error getting page.', error);
                        $scope.page = error_page;
                        $scope.page.slug = slug;
                        $scope.page.error = error;
                    }
                    else
                    {
                        $scope.page = page || not_found;
                        $scope.page.slug = slug;
                    } // end if
                });
            });
        } // end if
    });
} // end PagesController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('deluge.controllers').controller('PagesController', ['$scope', '$routeParams', '$location', PagesController]);

// ---------------------------------------------------------------------------------------------------------------------

