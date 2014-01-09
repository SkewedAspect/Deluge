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

module.controller('PagesController', function($scope, $routeParams, $location)
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

    /*
    $scope.pages = {
        '/': {
            title: "Home",
            content: "# Welcome!" +
                "\n\n This is my testing page. It shouldn't have a little blue home button on it. As long as it doesn't we're fine." +
                "\n\n## Points of Interest" +
                "\n\n Here's a list of some pages you might want to check out:" +
                "\n\n* [Foopage](/foo) - This is the Foopage. World famous." +
                "\n* [Some Random Slug](/some-random-slug) - **Spoilers!** There's a twist at the end!"
        },
        foo: {
            title: "Foopage",
            content: "Wonderful little foo page. Wouldn't you say so?"
        },
        'some-random-slug': {
            title: "Some Random Slug",
            content: "The good news is, this is not as random as you might believe!" +
                "\n\n" +
                "```javascript\n" +
                "{\n" +
                "    foo: \"bar\"\n" +
                "}\n" +
                "```"
        }
    };*/

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
                    } // end if
                });
            });
        } // end if
    });
});

// ---------------------------------------------------------------------------------------------------------------------