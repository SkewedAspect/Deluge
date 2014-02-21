//----------------------------------------------------------------------------------------------------------------------
// The controller for the admin section.
//
// @module admin.controllers.js
//----------------------------------------------------------------------------------------------------------------------

function AdminController ($scope, $routeParams, $location, $socket)
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
        $socket.emit('list users', function(error, users)
        {
            if(error)
            {
                console.error('Error getting user:', error);
                callback(error)
            }
            else
            {
                    $scope.users = users || [];
                    callback(error);
            } // end if
        });
    } // listUsers

    //------------------------------------------------------------------------------------------------------------------

    // Get a list of page templates
    $socket.emit('list page templates', function(error, templates)
    {
        if(error)
        {
            console.error('Error getting page templates:', error);
        }
        else
        {
            $scope.page_templates = templates || [];
        } // end if
    });

    // Get a list of article templates
    $socket.emit('list article templates', function(error, templates)
    {
        if(error)
        {
            console.error('Error getting article templates:', error);
        }
        else
        {
            $scope.article_templates = templates || [];
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
                $socket.emit('add page', page, function(error)
                {
                    if(error)
                    {
                        console.error('Error while adding a page.', error);
                    } // end if

                    $location.path('/admin');
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
                $socket.emit('add article', article, function(error)
                {
                    if(error)
                    {
                        console.error('Error while adding a article.', error);
                    } // end if

                    $location.path('/admin');
                });
            }; // end $scope.save

            break;

        //--------------------------------------------------------------------------------------------------------------

        case 'user':
            $scope.page_title = "Edit User '" + $scope.slug + "'";
            $scope.admin_tpl = '/components/admin/partials/edit_user.html';

            $socket.emit('get user', $scope.slug, function(error, user)
            {
                if(error)
                {
                    console.error('Error while getting a user.', error);
                } // end if

                $scope.userObj = user;
            });

            $scope.save = function(editUser, stay)
            {
                $socket.emit('update user', editUser, function(error)
                {
                    if(error)
                    {
                        console.error('Error while updating a user.', error);
                    } // end if

                    if(!stay)
                    {
                        $scope.user = editUser;
                        $location.path('/admin');
                    } // end if
                });
            }; // end $scope.save

            break;

        //--------------------------------------------------------------------------------------------------------------

        case 'page':
            $scope.page_title = "Edit '" + $scope.slug + "' Page";
            $scope.admin_tpl = '/components/admin/partials/edit_page.html';

            $socket.emit('get page', $scope.slug, includeDrafts, function(error, page)
            {
                if(error)
                {
                    console.error('Error while getting a page.', error);
                } // end if

                $scope.page = page;
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
                $socket.emit('update page', editPage, function(error)
                {
                    if(error)
                    {
                        console.error('Error while updating a page.', error);
                    } // end if

                    if(!stay)
                    {
                        $scope.page = editPage;
                        $location.path('/admin');
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

            $socket.emit('get article', $scope.slug, includeDrafts, function(error, article)
            {
                if(error)
                {
                    console.error('Error while getting a article.', error);
                } // end if

                $scope.article = article;
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
                $socket.emit('update article', editArticle, function(error)
                {
                    if(error)
                    {
                        console.error('Error while adding a article.', error);
                    } // end if

                    if(!stay)
                    {
                        $scope.article = editArticle;
                        $location.path('/admin');
                    } // end if
                });
            }; // end $scope.publish

            break;
    } // end switch

    //------------------------------------------------------------------------------------------------------------------

    $scope.removeUser = function(id)
    {
        $socket.emit('remove user', id, function(error)
        {
            if(error)
            {
                console.error('Error while removing a user.', error);
            } // end if

            _.remove($scope.users, { id: id });
            $location.path('/admin');
        });
    };

    $scope.removePage = function(slug)
    {
        $socket.emit('remove page', slug, function(error)
        {
            if(error)
            {
                console.error('Error while removing a page.', error);
            } // end if

            _.remove($scope.pages, { slug: slug });
            $location.path('/admin');
        });
    };

    $scope.removeArticle = function(slug)
    {
        $socket.emit('remove article', slug, function(error)
        {
            if(error)
            {
                console.error('Error while removing an article.', error);
            } // end if

            _.remove($scope.articles, { slug: slug });
            $location.path('/admin');
        });
    };

    //------------------------------------------------------------------------------------------------------------------

    if(!$scope.admin_tpl)
    {
        // List users
        listUsers();

        // List pages
        $socket.emit('list pages', includeDrafts, function(error, pages)
        {
            $scope.pages = pages;
        });

        // List articles
        $socket.emit('list articles', includeDrafts, function(error, articles)
        {
            $scope.articles = articles;
        });
    } // end if
} // end AdminController

//----------------------------------------------------------------------------------------------------------------------

angular.module('deluge.controllers').controller('AdminController', ['$scope', '$routeParams', '$location', '$socket', AdminController]);

//----------------------------------------------------------------------------------------------------------------------

