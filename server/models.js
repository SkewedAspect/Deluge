//----------------------------------------------------------------------------------------------------------------------
// Brief description for models.js module.
//
// @module models.js
//----------------------------------------------------------------------------------------------------------------------

var om = require('omega-models');
var fields = om.fields;
var SimpleBackend = om.backends.Simple;
var ns = om.namespace('deluge').backend(new NedbBackend({ rootDir: './db' }));

//----------------------------------------------------------------------------------------------------------------------

module.exports = ns.define({
    User: {
        email: fields.String({ key: true }),
        name: fields.String(),
        nick: fields.String(),
        groups: fields.List({ type: fields.Reference({ model: 'Group' }) })
    },

    Group: {
        name: fields.String({ key: true }),
        permissions: fields.List({ type: fields.String() })
    }
}); // end exports

//----------------------------------------------------------------------------------------------------------------------