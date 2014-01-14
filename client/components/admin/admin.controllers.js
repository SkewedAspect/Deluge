module.controller('AdminController', function($scope, $routeParams, $location)
{
    $scope.slug = $routeParams.slug || '/';
    $scope.page = {};

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
            $scope.preview = true;
            $scope.page_title = "Edit '" + $scope.slug + "' Page";
            $scope.admin_tpl = '/components/admin/partials/edit_page.html';
            var includeDrafts = true;

            $scope.socket.emit('get page', $scope.slug, includeDrafts, function(error, page)
            {
                if(error)
                {
                    console.error('Error while getting a page.', error);
                } // end if

                $scope.$apply(function()
                {
                    $scope.page = page;
                });
            });

            $scope.unpublish = function(editPage)
            {
                editPage.draft = true;

                $scope.save(editPage, 'continue');
            }; // end $scope.publish

            $scope.publish = function(editPage)
            {
                // Publishing means it's no longer a draft
                editPage.draft = false;

                $scope.save(editPage, 'continue');
            }; // end $scope.publish

            $scope.save = function(editPage, stay)
            {
                $scope.socket.emit('update page', editPage, function(error)
                {
                    if(error)
                    {
                        console.error('Error while adding a page.', error);
                    } // end if

                    if(!stay)
                    {
                        $scope.$apply(function()
                        {
                            $scope.page = editPage;
                            $location.path('/admin');
                        });
                    } // end if
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
                $location.path('/admin');
            });
        });
    };

    //------------------------------------------------------------------------------------------------------------------

    if(!$scope.admin_tpl)
    {
        var includeDrafts = true;
        $scope.socket.emit('list pages', includeDrafts, function(error, pages)
        {
            $scope.$apply(function()
            {
                $scope.pages = pages;
            });
        });
    } // end if
});
