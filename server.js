//----------------------------------------------------------------------------------------------------------------------
// Brief description for server.js module.
//
// @module server.js
//----------------------------------------------------------------------------------------------------------------------

var fs = require('fs');
var path = require('path');

var app = require('omega-wf').app;
var auth = require('omega-wf').auth;

var package = require('./package');
var config = require('./config')

var logger = require('omega-logger').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

require('./server/authentication');
require('./server/sockets');

//----------------------------------------------------------------------------------------------------------------------

app.router.add(
    // Static Files
    {
        url: '/client/*',
        path: path.join(__dirname, 'built')
    },
    {
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
