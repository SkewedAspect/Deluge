//----------------------------------------------------------------------------------------------------------------------
// A simple configuration file. To add a configuration key, do so in the module.exports object.
//
// @module config.js
//----------------------------------------------------------------------------------------------------------------------

module.exports = {

    // A simple get function that works like python's dictionary 'get'
    get: function (key, defaultValue)
    {
        if(key in module.exports)
        {
            return module.exports[key];
        } // end if

        return defaultValue;
    },

    // Whether or not the site's in DEBUG mode
    debug: true,

    // Website port
    port: 7070,

    // Title of the application
    title: "Deluge CMS"
}; // end exports

//----------------------------------------------------------------------------------------------------------------------


//----------------------------------------------------------------------------------------------------------------------