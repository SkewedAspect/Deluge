//----------------------------------------------------------------------------------------------------------------------
// The controller for the admin section.
//
// @module admin.controllers.js
//----------------------------------------------------------------------------------------------------------------------

function AdminController ($scope, $routeParams, $location)
{
    $scope.slug = $routeParams.slug || '/';
    $scope.page = { template: '/components/pages/partials/default.html' };
    $scope.preview = true;

    var includeDrafts = true;

    //------------------------------------------------------------------------------------------------------------------

    if(!$scope.user || !$scope.user.admin)
    {
        $location.path('/');
    } // end if

    //------------------------------------------------------------------------------------------------------------------

    function listUsers(callback)
    {
        callback = callback || function(){};

        // Get a list of users
        $scope.socket.emit('list users', function(error, users)
        {
            if(error)
            {
                console.error('Error getting user:', error);
                callback(error)
            }
            else
            {
                $scope.$apply(function()
                {
                    $scope.users = users || [];
                    callback(error);
                });
            } // end if
        });
    } // listUsers

    //------------------------------------------------------------------------------------------------------------------

    // Get a list of page templates
    $scope.socket.emit('list page templates', function(error, templates)
    {
        if(error)
        {
            console.error('Error getting page templates:', error);
        }
        else
        {
            $scope.$apply(function()
            {
                $scope.page_templates = templates || [];
            });
        } // end if
    });

    // Get a list of article templates
    $scope.socket.emit('list article templates', function(error, templates)
    {
        if(error)
        {
            console.error('Error getting article templates:', error);
        }
        else
        {
            $scope.$apply(function()
            {
                $scope.article_templates = templates || [];
            });
        } // end if
    });

    //------------------------------------------------------------------------------------------------------------------
    // Route admin section
    //------------------------------------------------------------------------------------------------------------------

    switch($routeParams.section)
    {
        case 'add_page':
            $scope.page_title = "Add New Page";
            $scope.admin_tpl = '/components/admin/partials/add_page.html';

            $scope.publish = function(page)
            {
                // Publishing means it's no longer a draft
                page.draft = false;

                $scope.save(page);
            }; // end $scope.publish

            $scope.save = function(page)
            {
                $scope.socket.emit('add page', page, function(error)
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
            }; // end $scope.save

            break;

        //--------------------------------------------------------------------------------------------------------------

        case 'add_article':
            $scope.page_title = "Add New Article";
            $scope.admin_tpl = '/components/admin/partials/add_article.html';

            // List users
            listUsers();

            $scope.publish = function(article)
            {
                // Publishing means it's no longer a draft
                article.draft = false;

                $scope.save(article);
            }; // end $scope.publish

            $scope.save = function(article)
            {
                $scope.socket.emit('add article', article, function(error)
                {
                    if(error)
                    {
                        console.error('Error while adding a article.', error);
                    } // end if

                    $scope.$apply(function()
                    {
                        $location.path('/admin');
                    });
                });
            }; // end $scope.save

            break;

        //--------------------------------------------------------------------------------------------------------------

        case 'user':
            $scope.page_title = "Edit User '" + $scope.slug + "'";
            $scope.admin_tpl = '/components/admin/partials/edit_user.html';

            $scope.socket.emit('get user', $scope.slug, function(error, user)
            {
                if(error)
                {
                    console.error('Error while getting a user.', error);
                } // end if

                $scope.$apply(function()
                {
                    $scope.userObj = user;
                });
            });

            $scope.save = function(editUser, stay)
            {
                $scope.socket.emit('update user', editUser, function(error)
                {
                    if(error)
                    {
                        console.error('Error while updating a user.', error);
                    } // end if

                    if(!stay)
                    {
                        $scope.$apply(function()
                        {
                            $scope.user = editUser;
                            $location.path('/admin');
                        });
                    } // end if
                });
            }; // end $scope.save

            break;

        //--------------------------------------------------------------------------------------------------------------

        case 'page':
            $scope.page_title = "Edit '" + $scope.slug + "' Page";
            $scope.admin_tpl = '/components/admin/partials/edit_page.html';

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
                        console.error('Error while updating a page.', error);
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

            // List users
            listUsers();

            $scope.socket.emit('get article', $scope.slug, includeDrafts, function(error, article)
            {
                if(error)
                {
                    console.error('Error while getting a article.', error);
                } // end if

                $scope.$apply(function()
                {
                    $scope.article = article;
                });
            });

            $scope.unpublish = function(editArticle)
            {
                editArticle.draft = true;

                $scope.save(editArticle, 'continue');
            }; // end $scope.publish

            $scope.publish = function(editArticle)
            {
                // Publishing means it's no longer a draft
                editArticle.draft = false;

                $scope.save(editArticle, 'continue');
            }; // end $scope.publish

            $scope.save = function(editArticle, stay)
            {
                $scope.socket.emit('update article', editArticle, function(error)
                {
                    if(error)
                    {
                        console.error('Error while adding a article.', error);
                    } // end if

                    if(!stay)
                    {
                        $scope.$apply(function()
                        {
                            $scope.article = editArticle;
                            $location.path('/admin');
                        });
                    } // end if
                });
            }; // end $scope.publish

            break;
    } // end switch

    //------------------------------------------------------------------------------------------------------------------

    $scope.removeUser = function(id)
    {
        $scope.socket.emit('remove user', id, function(error)
        {
            if(error)
            {
                console.error('Error while removing a user.', error);
            } // end if

            $scope.$apply(function()
            {
                _.remove($scope.users, { id: id });
                $location.path('/admin');
            });
        });
    };

    $scope.removePage = function(slug)
    {
        $scope.socket.emit('remove page', slug, function(error)
        {
            if(error)
            {
                console.error('Error while removing a page.', error);
            } // end if

            $scope.$apply(function()
            {
                _.remove($scope.pages, { slug: slug });
                $location.path('/admin');
            });
        });
    };

    $scope.removeArticle = function(slug)
    {
        $scope.socket.emit('remove article', slug, function(error)
        {
            if(error)
            {
                console.error('Error while removing an article.', error);
            } // end if

            $scope.$apply(function()
            {
                _.remove($scope.articles, { slug: slug });
                $location.path('/admin');
            });
        });
    };

    //------------------------------------------------------------------------------------------------------------------

    if(!$scope.admin_tpl)
    {
        // List users
        listUsers();

        // List pages
        $scope.socket.emit('list pages', includeDrafts, function(error, pages)
        {
            $scope.$apply(function()
            {
                $scope.pages = pages;
            });
        });

        // List articles
        $scope.socket.emit('list articles', includeDrafts, function(error, articles)
        {
            $scope.$apply(function()
            {
                $scope.articles = articles;
            });
        });
    } // end if
} // end AdminController

//----------------------------------------------------------------------------------------------------------------------

angular.module('deluge.controllers').controller('AdminController', ['$scope', '$routeParams', '$location', AdminController]);

//----------------------------------------------------------------------------------------------------------------------

