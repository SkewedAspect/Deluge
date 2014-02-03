//----------------------------------------------------------------------------------------------------------------------
// Brief description for models.js module.
//
// @module models.js
//----------------------------------------------------------------------------------------------------------------------

var om = require('omega-models');
var fields = om.fields;
var SimpleBackend = om.backends.Simple;
var ns = om.namespace('deluge').backend(new SimpleBackend({ rootDir: './db' }));

//----------------------------------------------------------------------------------------------------------------------

module.exports = ns.define({
    User: {
        id: fields.String({ key: true }),
        email: fields.String(),
        name: fields.String(),
        nick: fields.String(),
        avatar: fields.String(),
        admin: fields.Boolean({ default: false }),
        groups: fields.List({ type: fields.Reference({ model: 'Group' }) }),

        tokens: fields.Dict()
    },

    Group: {
        name: fields.String({ key: true }),
        description: fields.String()
    },

    Page: {
        title: fields.String(),
        slug: fields.String({ key: true }),
        content: fields.String(),
        template: fields.String(),
        draft: fields.Boolean({ default: true }),
        created: fields.DateTime({ first: true }),
        modified: fields.DateTime({ auto: true }),

        permission_descriptions: fields.Property(function()
        {
            return {
                'can_add': 'Ability to add pages.',
                'can_view': 'Ability to view pages.',
                'can_edit': 'Ability to edit pages.',
                'can_delete': 'Ability to delete pages.'
            };
        }),
        permissions: fields.Dict({ default:{
            'can_add': ['*'],
            'can_view': ['*'],
            'can_edit': ['*'],
            'can_delete': ['*']
        }}),

        owner: fields.Reference({ model: 'User' })
    },

    Article: {
        title: fields.String(),
        tagline: fields.String(),
        slug: fields.String({ key: true }),
        content: fields.String(),
        template: fields.String(),
        tags: fields.List({ type: fields.String() }),

        draft: fields.Boolean({ default: true }),
        featured: fields.Boolean({ default: false }),
        created: fields.DateTime({ first: true }),
        modified: fields.DateTime({ auto: true }),

        permission_descriptions: fields.Property(function()
        {
            return {
                'can_add': 'Ability to add articles.',
                'can_view': 'Ability to view articles.',
                'can_edit': 'Ability to edit articles.',
                'can_delete': 'Ability to delete articles.'
            };
        }),
        permissions: fields.Dict({ default:{
            'can_add': ['*'],
            'can_view': ['*'],
            'can_edit': ['*'],
            'can_delete': ['*']
        }}),

        owner: fields.Reference({ model: 'User' })
    }
}); // end exports

//----------------------------------------------------------------------------------------------------------------------