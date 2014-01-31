//----------------------------------------------------------------------------------------------------------------------
// Brief description for sockets.js module.
//
// @module sockets.js
//----------------------------------------------------------------------------------------------------------------------

var path = require('path');

var app = require('omega-wf').app;
var async = require('async');
var walk = require('walk');
var _ = require('lodash');

var config = require('../config');
var models = require('./models');

var logger = require('omega-wf').logging.loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

// Enable authentication
//app.sockets.enableAuth();

app.sockets.on('connection', function(socket)
{
    var user = socket.handshake.user;

    console.log('user:', user);

    //------------------------------------------------------------------------------------------------------------------
    // Page Templates
    //------------------------------------------------------------------------------------------------------------------

    socket.on('list page templates', function(cb)
    {
        var templatePath = config.get('pageTemplates', './client/components/pages/partials/');
        var walker = walk.walk(templatePath, { followLinks: true });

        var templates = [];

        walker.on('file', function(root, stat, next)
        {
            var name = stat.name.replace('.tpl', '');

            // We need to filter out certain files if we use the default template directory.
            if(['fallback.tpl.html', 'notfound.tpl.html', 'pages.tpl.html'].indexOf(stat.name) == -1 || templatePath != './client/components/pages/partials/')
            {
                var templateUrlRoot = root.replace('./client', '');
                templates.push({ base: name, template: templateUrlRoot + name });
            } // end if

            next();
        });

        walker.on('end', function()
        {
            cb(undefined, templates)
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Pages
    //------------------------------------------------------------------------------------------------------------------

    socket.on('list pages', function(includeDrafts, cb)
    {
        filter = { draft: false };

        if(includeDrafts)
        {
            var filter = {};
        } // end if

        models.Page.find(filter, function(error, pages)
        {
            if(error)
            {
                logger.error('Error retrieving pages: %s\n  %s', error.message || error.toString(), error.stack || "");
            } // end if

            cb(error, pages);
        });
    });

    socket.on('has pages', function(cb)
    {
        models.Page.find({ draft: false }, function(error, pages)
        {
            if(error)
            {
                logger.error('Error retrieving pages: %s\n  %s', error.message || error.toString(), error.stack || "");
            } // end if

            // If we get back pages, or we return false
            cb(error, !!(pages || []).length);
        });
    });

    socket.on('add page', function(page, cb)
    {

        var model = new models.Page(page);
        model.save(function(error)
        {
            if(error)
            {
                logger.error('Error saving page: %s\n  %s', error.message || error.toString(), error.stack || "");
            } // end if

            cb(error, page);
        });
    });

    socket.on('get page', function(slug, includeDrafts, cb)
    {
        var filter = { slug: slug, draft: false };

        if(arguments.length == 2)
        {
            cb = includeDrafts;
            includeDrafts = false;
        } // end if

        if(includeDrafts)
        {
            filter = { slug: slug };
        } // end if

        models.Page.findOne(filter, function(error, page)
        {
            if(error)
            {
                logger.error('Error retrieving page: %s\n  %s', error.message || error.toString(), error.stack || "");
            } // end if

            cb(error, page);
        });
    });

    socket.on('update page', function(page, cb)
    {
        models.Page.update({ slug: page.slug }, page, function(error)
        {
            if(error)
            {
                logger.error('Error retrieving page: %s\n  %s', error.message || error.toString(), error.stack || "");
            } // end if

            cb(error);
        });
    });

    socket.on('remove page', function(slug, cb)
    {
        models.Page.remove({ slug: slug }, function(error)
        {
            if(error)
            {
                logger.error('Error retrieving page: %s\n  %s', error.message || error.toString(), error.stack || "");
            } // end if

            cb(error);
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Article Templates
    //------------------------------------------------------------------------------------------------------------------

    socket.on('list article templates', function(cb)
    {
        var templatePath = config.get('articleTemplates', './client/components/articles/partials/');
        var walker = walk.walk(templatePath, { followLinks: true });

        var templates = [];

        walker.on('file', function(root, stat, next)
        {
            var name = stat.name.replace('.tpl', '');

            // We need to filter out certain files if we use the default template directory.
            if(['fallback.tpl.html', 'notfound.tpl.html', 'articles.tpl.html', 'recent.tpl.html', 'list.tpl.html'].indexOf(stat.name) == -1 || templatePath != './client/components/articles/partials/')
            {
                var templateUrlRoot = root.replace('./client', '');
                templates.push({ base: name, template: templateUrlRoot + name });
            } // end if

            next();
        });

        walker.on('end', function()
        {
            cb(undefined, templates)
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Articles
    //------------------------------------------------------------------------------------------------------------------

    socket.on('list articles', function(includeDrafts, cb)
    {
        filter = { draft: false };

        if(includeDrafts)
        {
            var filter = {};
        } // end if

        models.Article.find(filter, function(error, articles)
        {
            if(error)
            {
                logger.error('Error retrieving articles: %s\n  %s', error.message || error.toString(), error.stack || "");
            } // end if

            cb(error, articles);
        });
    });

    socket.on('find articles', function(filter, tags, cb)
    {
        if(arguments.length == 2)
        {
            cb = tags;
            tags = [];
        } // end if

        if(!tags)
        {
            tags = [];
        } // end if

        models.Article.find(filter, function(error, articles)
        {
            if(error)
            {
                logger.error('Error retrieving articles: %s\n  %s', error.message || error.toString(), error.stack || "");
            } // end if

            if(tags.length)
            {
                var matched = [];
                for(var idx = 0; idx < articles.length; idx++)
                {
                    var match = true;
                    var article = articles[idx];
                    for(var ydx = 0; ydx < tags.length; ydx++)
                    {
                        var tag = tags[ydx];
                        if(!_.contains(article.tags, tag))
                        {
                            match = false;
                            break;
                        } // end if
                    } // end for

                    if(match)
                    {
                        matched.push(article);
                    } // end if
                } // end for
                cb(error, matched);
            }
            else
            {
                cb(error, articles);
            } // end if
        });
    });

    //TODO: Is this needed?
    socket.on('has articles', function(cb)
    {
        models.Article.find({ draft: false }, function(error, articles)
        {
            if(error)
            {
                logger.error('Error retrieving articles: %s\n  %s', error.message || error.toString(), error.stack || "");
            } // end if

            // If we get back articles, or we return false
            cb(error, !!(articles || []).length);
        });
    });

    socket.on('add article', function(article, cb)
    {
        var model = new models.Article(article);
        model.save(function(error)
        {
            if(error)
            {
                logger.error('Error saving article: %s\n  %s', error.message || error.toString(), error.stack || "");
            } // end if

            cb(error, article);
        });
    });

    socket.on('get article', function(slug, includeDrafts, cb)
    {
        var filter = { slug: slug, draft: false };

        if(arguments.length == 2)
        {
            cb = includeDrafts;
            includeDrafts = false;
        } // end if

        if(includeDrafts)
        {
            filter = { slug: slug };
        } // end if

        models.Article.findOne(filter, function(error, article)
        {
            if(error)
            {
                logger.error('Error retrieving article: %s\n  %s', error.message || error.toString(), error.stack || "");
            } // end if

            cb(error, article);
        });
    });

    socket.on('update article', function(article, cb)
    {
        models.Article.update({ slug: article.slug }, article, function(error)
        {
            if(error)
            {
                logger.error('Error retrieving article: %s\n  %s', error.message || error.toString(), error.stack || "");
            } // end if

            cb(error);
        });
    });

    socket.on('remove article', function(slug, cb)
    {
        models.Article.remove({ slug: slug }, function(error)
        {
            if(error)
            {
                logger.error('Error retrieving article: %s\n  %s', error.message || error.toString(), error.stack || "");
            } // end if

            cb(error);
        });
    });

    //------------------------------------------------------------------------------------------------------------------
});

//----------------------------------------------------------------------------------------------------------------------