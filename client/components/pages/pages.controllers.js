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

module.controller('PagesController', function($scope, $routeParams)
{
    var default_page = {
        title: "Page not found",
        template: buildTemplateURL('notfound')
    };

    var fallback_page = {
        title: "Deluge Welcome Page",
        template: buildTemplateURL('fallback')
    };

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
            content: "The good news is, this is not as random as you might believe!"
        }
    };

    // Detect a lack of pages, and display a friendly page.
    if(!$scope.pages || Object.keys($scope.pages).length == 0)
    {
        $scope.page = fallback_page;
    }
    else
    {
        var slug = $routeParams.slug || '/';
        $scope.page = $scope.pages[slug] || default_page;
        $scope.page.slug = slug;
    } // end if
});

// ---------------------------------------------------------------------------------------------------------------------