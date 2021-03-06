//----------------------------------------------------------------------------------------------------------------------
// Gruntfile
//----------------------------------------------------------------------------------------------------------------------

var config = require('./config');

//----------------------------------------------------------------------------------------------------------------------

module.exports = function(grunt)
{
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        settings: config,
		project: {
            base: "client",
            dest: "built",
            vendor: "client/vendor",
            static: "client/static",
			css: "built/css",
			less: "client/less",
			components: {
				less: "client/components/**/*.less",
                js: "client/components/**/*.js",
                controllers: "client/components/**/*controller*.js",
                directives: "client/components/**/*directive*.js",
                filters: "client/components/**/*filter*.js"
			}
		},
        built: {
            base: "built",
            js: [
                'js/codemirror/lib/codemirror.js',
                'js/codemirror/**/*.js',
                'js/highlightjs/**/*.js',
                'js/angularjs/angular.min.js',
                'js/angularjs/*.min.js',
                'js/app.js',
                'js/modules.js',
                'js/client.templates.js',
                'js/**/*.js'
            ]
        },
        clean: {
            built: '<%=built.base%>'
        },
        copy: {
            client: {
                files: [
                    { expand: true, flatten: true, src: ['client/app.js', 'client/modules.js'], dest: '<%= project.dest %>/js', filter: 'isFile' },
                    { expand: true, flatten: true, src: ['<%=project.static%>/**'], dest: '<%= project.dest %>/static', filter: 'isFile' },
                    { expand: true, cwd: '<%=project.vendor%>/', src: ['**/*.js', '!bootstrap/**/*.js'], dest: '<%= project.dest %>/js', filter: 'isFile' }
                ]
            },
            components: {
                files: [
                    { expand: true, cwd: '<%=project.base%>/', src: ['components/**/*.js'], dest: '<%= project.dest %>/js', filter: 'isFile' }
                ]
            },
            vendor: {
                files: [
                    { expand: true, flatten: true, src: ['<%=project.vendor%>/**/*.css', '!<%=project.vendor%>/bootstrap/**/*.css'], dest: '<%= project.dest %>/css', filter: 'isFile' },
                    { expand: true, flatten: true, src: ['<%=project.vendor%>/**/fonts/*'], dest: '<%= project.dest %>/fonts', filter: 'isFile' }
                ]
            },
            index: {
                options: {
                    processContent: grunt.template.process
                },
                files: [
                    { expand: true, flatten: true, src: ['client/index.html'], dest: '<%= project.dest %>', filter: 'isFile' }
                ]
            }
        },
        html2js: {
            client: {
                src: ['client/**/*.tpl.html'],
                dest: 'built/js/client.templates.js',
                options: {
                    base: 'client',
                    module: 'client.templates',
                    rename: function (moduleName) {
                        return '/' + moduleName.replace('.tpl', '');
                    }
                }
            }
        },
        less: {
            dev: {
                options: {
                    paths: ['<%=project.vendor%>']
                },
                files: {
                    '<%= project.css %>/theme.css': ['<%= project.less %>/**/*.less', '<%= project.components.less %>']
                }
            },
            min: {
                options: {
                    paths: ['<%=project.vendor%>'],
                    compress: true
                },
                files: {
                    '<%= project.css %>/theme.min.css': ['<%= project.less %>/**/*.less', '<%= project.components.less %>']
                }
            }
        },
        develop: {
            server: {
                file: 'server.js'
            }
        },
        vendor: {
            options: {
                dest: '<%=project.vendor%>',
                replace: false
            },
            bootstrap: {
                url: 'https://github.com/twbs/bootstrap/archive/v3.0.3.zip',
                renameZipRoot: true
            },
            fontawesome: {
                url: 'http://fontawesome.io/assets/font-awesome-4.0.3.zip',
                renameZipRoot: true
            },
            'ui-codemirror': {
                url: 'https://github.com/angular-ui/ui-codemirror/archive/v0.1.0.zip',
                renameZipRoot: true
            },
            'codemirror': {
                basepath: 'https://raw.github.com/marijnh/CodeMirror/v3.12/',
                src: ['lib/codemirror.js', 'lib/codemirror.css', 'addon/mode/overlay.js',
                    'mode/markdown/markdown.js',
                    'mode/gfm/gfm.js',

                    // Languages to support highlighting in code blocks, in the editor
                    'mode/css/css.js',
                    'mode/diff/diff.js',
                    'mode/erlang/erlang.js',
                    'mode/go/go.js',
                    'mode/htmlembedded/htmlembedded.js',
                    'mode/javascript/javascript.js',
                    'mode/less/less.js',
                    'mode/python/python.js',
                    'mode/shell/shell.js',
                    'mode/yaml/yaml.js'
                ]
            },
            'angular-gplus': {
                basepath: 'https://raw.github.com/sirkitree/angular-directive.g-signin/master/',
                src: ['google-plus-signin.js']
            },
            highlightjs: {
                basepath: 'http://yandex.st/highlightjs/8.0/',
                src: ['highlight.min.js', 'styles/github.min.css']
            },
            angularjs: {
                basepath: 'http://code.angularjs.org/1.2.7/',
                src: ['angular.min.js', 'angular-route.min.js', 'angular-resource.min.js', 'angular-cookies.min.js', 'angular-touch.min.js', 'angular-animate.min.js']
            },
            'ui-bootstrap': {
                basepath: 'https://raw.github.com/angular-ui/bootstrap/gh-pages/',
                src: ['ui-bootstrap-tpls-0.9.0.js', 'ui-bootstrap-tpls-0.9.0.min.js']
            },
            'lodash': {
                basepath: 'https://raw.github.com/lodash/lodash/2.4.1/dist/',
                src: ['lodash.min.js']
            },
            'angular-slugify': {
                basepath: 'https://raw.github.com/paulsmith/angular-slugify/master/',
                src: ['angular-slugify.js']
            },
            marked: {
                basepath: 'https://raw.github.com/chjj/marked/master/lib/',
                src: ['marked.js']
            },
            spacelab: {
                basepath: 'http://bootswatch.com/spacelab/',
                src: ['variables.less', 'bootswatch.less']
            }
        },
        watch: {
            index: {
                files: ['client/index.html'],
                tasks: ['html2js', 'copy', 'copy:index'],
                options: {
                    livereload: true,
                    atBegin: true
                }
            },
            server: {
                files: ['server.js', 'server/*.js'],
                tasks: ['develop'],
                options: {
                    atBegin: true,
                    nospawn: true
                }
            },
            copy: {
                files: ['client/app.js', '<%=project.static%>/**', '<%=project.vendor%>/**/*.js'],
                tasks: ['copy'],
                options: {
                    livereload: true,
                    atBegin: true
                }
            },
            client_js: {
                files: ['<%= project.components.controllers %>', '<%= project.components.directives %>', '<%= project.components.filters %>'],
                tasks: ['copy:components'],
                options: {
                    livereload: true,
                    atBegin: true
                }
            },
            html2js: {
                files: ['client/**/*.tpl.html'],
                tasks: ['html2js'],
                options: {
                    livereload: true,
                    atBegin: true
                }
            },
            less: {
                files: ['<%= project.less %>/*.less', '<%= project.components.less %>'],
                tasks: ['less'],
                options: {
                    livereload: true,
                    atBegin: true
                }
            }
        }
    });

    // Grunt Tasks.
    grunt.loadNpmTasks('grunt-develop');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Custom Tasks
    grunt.loadTasks('tasks');

    // Setup the build task.
    grunt.registerTask('build', ['clean', 'html2js', 'copy', 'less']);
};
