//----------------------------------------------------------------------------------------------------------------------
// Brief description for authentication.js module.
//
// @module authentication.js
//----------------------------------------------------------------------------------------------------------------------

var app = require('omega-wf').app;
var auth = require('omega-wf').auth;

var GooglePlusStrategy = require('passport-google-plus');

var models = require('./models');
var logger = require('omega-logger').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

// Initialize the authentication framework.
app.init(function()
{
    // Tell the authentication system how to serialize the user for storage in the session
    auth.serializeUser(function(user, done)
    {
        done(null, user.$key);
    });

    // Tell the authentication system how to retrieve the user from what was put in the session
    auth.deserializeUser(function(key, done)
    {
        models.User.findOne(key, function(error, user)
        {
            if(error)
            {
                logger.error("Encountered error:", error);
                done(error);
            }
            else
            {
                if(user)
                {
                    done(null, user);
                }
                else
                {
                    logger.error("User not found.");
                    done("User not found", false);
                } // end if
            } // end if
        });
    });

    //------------------------------------------------------------------------------------------------------------------

    auth.use(new GooglePlusStrategy({
            clientId: '485489730379-caf5m39htm084go21i4k9l4142s2as0l.apps.googleusercontent.com',
            clientSecret: 'DJTbXLyabELjjS-_P_h-UCGw'
        },
        function(tokens, profile, done)
        {
            models.User.find(function(error, users)
            {
                console.log('All Users:', users);
            });

            models.User.findOne({ id: profile.id }, function(error, user)
            {
                if(error)
                {
                    logger.error('Error looking up user:', error.stack || error.message || error.toString());
                }
                else
                {
                    console.log('found user:', user);

                    var imageURL = "";
                    if(profile.image)
                    {
                        imageURL = profile.image.url;
                    } // end if

                    if(user)
                    {
                        // Update user
                        user.name = profile.displayName;
                        user.email = profile.email || user.email;
                        user.nick = profile.nickname;
                        user.avatar = imageURL;
                        user.tokens = tokens;

                        user.save(function()
                        {
                            done(null, user);
                        });
                    }
                    else
                    {
                        // Create new user
                        user = new models.User({
                            id: profile.id,
                            name: profile.displayName,
                            email: profile.email,
                            nick: profile.nickname,
                            avatar: imageURL,
                            tokens: tokens
                        });

                        user.save(function()
                        {
                            done(null, user);
                        });
                    } // end if
                } // end if
            });
        })
    );

    //------------------------------------------------------------------------------------------------------------------

    // Authentication Callback
    app.router.add({
        url:'/auth/google/callback',
        post: function(req, resp)
        {
            var authFunc = auth.authenticate('google');
            authFunc(req, resp, function(error) {
                if(error)
                {
                    var message = 'Error while attempting to log in:' + (error.stack || error.message || error.toString());
                    logger.error(message);

                    resp.writeHead(500, {
                        "Content-Type": "application/json"
                    });
                    resp.end(JSON.stringify({ message: message }));

                }
                else
                {
                    resp.writeHead(200, {
                        "Content-Type": "application/json"
                    });
                    resp.end(JSON.stringify({ user: req.user }));
                } // end if
            });
        }
    });

    //------------------------------------------------------------------------------------------------------------------

    // Give us an endpoint to get the current user.
    app.router.add({
        url: '/user',
        get: function(request, response)
        {
            if(request.user)
            {
                response.writeHead(200, {
                    "Content-Type": "application/json"
                });
                response.end(JSON.stringify({ user: request.user }));
            }
            else
            {
                response.writeHead(401, {
                    "Content-Type": "application/json"
                });
                response.end(JSON.stringify({message: "Not Authenticated"}));
            } // end if
        } // end get
    });
});

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
}; // end exports

//----------------------------------------------------------------------------------------------------------------------