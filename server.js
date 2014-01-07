//----------------------------------------------------------------------------------------------------------------------
// Brief description for server.js module.
//
// @module server.js
//----------------------------------------------------------------------------------------------------------------------

var fs = require('fs');
var path = require('path');

var app = require('omega-wf').app;

var package = require('./package');
var config = require('./config');

//----------------------------------------------------------------------------------------------------------------------

app.router.add(
    // Static Files
    {
        url: '/client/*',
        path: path.join(__dirname, 'built')
    },

    // Authentication
    /*
    {
        url:'/auth/login-persona',
        post: function(req, resp)
        {
            auth.authenticate('persona', {
                successRedirect: '/',
                failureRedirect: '/'
            })(req, resp, function(error)
            {
                console.log("Auth Error!", error);
            });
        }
    },
    {
        url: '/auth/logout-persona',
        post: function(request, response)
        {
            request.logout();
            response.redirect('/');
        } // end post
    },
    */
    {
        //url: /^\/(?!admin\/|client\/)/,
        url: '*',
        get: function(req, resp)
        {
            fs.createReadStream('./built/index.html').pipe(resp);
        }
    }
);

//----------------------------------------------------------------------------------------------------------------------

// Set the name of the omega app.
app.setName(config.get('title', 'Deluge CMS') + ' v' + package.version);

// Start the omega-wf app.
app.listen(config.get('port', 7070));

//----------------------------------------------------------------------------------------------------------------------
