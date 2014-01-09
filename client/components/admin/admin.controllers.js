module.controller('AdminController', function($scope, $routeParams, $location)
{
    $scope.slug = $routeParams.slug || '/';

    //------------------------------------------------------------------------------------------------------------------
    // Route admin section
    //------------------------------------------------------------------------------------------------------------------

    switch($routeParams.section)
    {
        case 'add_page':
            $scope.page_title = "Add New Page";
            $scope.admin_tpl = '/components/admin/partials/add_page.html';

            $scope.publish = function(newPage)
            {
                // Publishing means it's no longer a draft
                newPage.draft = false;

                $scope.save(newPage);
            }; // end $scope.publish

            $scope.save = function(newPage)
            {
                $scope.socket.emit('add page', newPage, function(error)
                {
                    if(error)
                    {
                        console.error('Error while adding a page.', error);
                    } // end if

                    $scope.$apply(function()
                    {
                        $location.path('/admin');
                    });
                });
            }; // end $scope.publish

            break;

        //--------------------------------------------------------------------------------------------------------------

        case 'add_article':
            $scope.page_title = "Add New Article";
            $scope.admin_tpl = '/components/admin/partials/add_article.html';
            break;

        //--------------------------------------------------------------------------------------------------------------

        case 'page':
            $scope.page_title = "Edit '" + $scope.slug + "' Page";
            $scope.admin_tpl = '/components/admin/partials/edit_page.html';

            $scope.socket.emit('get page', $scope.slug, function(error, page)
            {
                if(error)
                {
                    console.error('Error while getting a page.', error);
                } // end if

                $scope.$apply(function()
                {
                    console.log('setting page', page);
                    $scope.editPage = page;
                });
            });

            $scope.publish = function(newPage)
            {
                // Publishing means it's no longer a draft
                newPage.draft = false;

                $scope.save(newPage);
            }; // end $scope.publish

            $scope.save = function(newPage)
            {
                $scope.socket.emit('update page', newPage, function(error)
                {
                    if(error)
                    {
                        console.error('Error while adding a page.', error);
                    } // end if

                    $scope.$apply(function()
                    {
                        $location.path('/admin');
                    });
                });
            }; // end $scope.publish

            break;

        //--------------------------------------------------------------------------------------------------------------

        case 'article':
            $scope.page_title = "Edit '" + $scope.slug + "' article";
            $scope.admin_tpl = '/components/admin/partials/edit_article.html';
            break;
    } // end switch

    //------------------------------------------------------------------------------------------------------------------

    $scope.remove = function(slug)
    {
        $scope.socket.emit('remove page', slug, function(error)
        {
            if(error)
            {
                console.error('Error while adding a page.', error);
            } // end if

            $scope.$apply(function()
            {
                _.remove($scope.pages, { slug: slug });
            });
        });
    };

    //------------------------------------------------------------------------------------------------------------------

    if(!$scope.admin_tpl)
    {
        $scope.socket.emit('list pages', function(error, pages)
        {
            $scope.$apply(function()
            {
                $scope.pages = pages;
            });
        });
    } // end if
});
