# What even is this?

Deluge is, simply put, a bare-bones CMS system, written with node.js and Angular JS, using socket.io. It's like
Wordpress, only without the bloat. It's designed for web developers and power users, not casual users. And, best of all,
it's really just a node.js/angular web application; the CMS portion is entirely optional!

## Why another CMS?

Because this isn't actually a CMS. Basically, this is a default project template, with some pre-built components for
flatpages and articles. It's completely usable as a CMS, but you can rip those portions out and build whatever you like
instead. Or, you can build on this to add whatever additional functionality you'd like.

## What about plugins? Modules? Extensions?

You're a developer; write them!

What Deluge provides, is the `/client/components` folder. Any `*.controller*.js` file, or `*.filter*.js` file is
automatically watched, and compiled into the application for you. Any `*.less` file is also compiled for you. The
application already watches for any `*.tpl.html` files to build those into the angular template cache. So, really,
extending deluge with a new feature/module is pretty easy. Just put the files there, and it all works.

## What about themes?

You're a developer; write them!

Deluge has `client/less/theme.less` which is just a bunch of imports. By default, we use [SpaceLab](http://bootswatch.com/spacelab/)
from BootSwatch. You can easily edit `theme.less` and `GruntFile.js` to use any other bootstrap theme. If you want
something more complicated, you'll have to figure that out yourself.

# Getting Started

First things first: _fork this project_. This way, should you wish to update, you can use git to help handle the merges,
as well as already have a github project available for pushing your changes. You don't _have_ to fork, but I highly
recommend it.

Prerequisites:
- NodeJS - www.nodejs.org
- Grunt build system - http://gruntjs.com/getting-started

Installation:

1. `npm install` to get NodeJS dependencies
2. `grunt vendor` to get client-side dependencies
3. `grunt watch` to start the application.

From here, you're all set to get modifying, or even use it as is!
