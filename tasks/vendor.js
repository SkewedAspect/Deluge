//-----------------------------------------------------------------------------
// Grunt Vendor task
//
// @module vendor.js
//-----------------------------------------------------------------------------

var path = require('path');
var url = require('url');
var stream = require('stream');
var fs = require('fs');

var unzip = require('adm-zip');
var request = require('request');
var async = require('async');
var mv = require('mv');

//-----------------------------------------------------------------------------

module.exports = function (grunt) {
    //-------------------------------------------------------------------------
    // Helpers
    //-------------------------------------------------------------------------

    function getHttpFileStream(fileUrl, callback) {
        callback(request.get(fileUrl));
    };

    function getHttpFile(fileUrl, callback) {
        request({url:fileUrl, encoding: null}, function (error, response, body) {
            if (error) {
                grunt.log.error('  Error getting ' + fileUrl + '(' + error.toString() + ')\n');
                callback(error);
            }
            else if(response.statusCode != 200) {
                grunt.log.error('  HTTP error getting ' + fileUrl
                    + '( response code ' + response.statusCode + ')');
                callback(new Error('Response ' + response.statusCode));
            } else {
                grunt.log.writeln('  successfully downloaded: ' + fileUrl + '.');
                callback(null, body);
            }
        });
    };

    function writeFile(fileUrl, writepath, callback) {
        grunt.log.writeln('  writing: ' + writepath);
        getHttpFile(fileUrl,function(err, writeData) {
            if(err)  {
                grunt.log.error('  Error writing file:' + err);
            } else {
                grunt.file.write(writepath, writeData);
            }

            callback(err);
        });
    };

    function unzipFile(fileUrl, writepath, callback) {
        getHttpFile(fileUrl,function(err, writeData) {
            if(err)  {
                grunt.log.error('Error unzipping file:' + err);
            } else {
                var zip = new unzip(writeData);
                zip.extractAllTo(writepath, true);
            }

            callback(err, zip.getEntries());
        });
    };

    //-------------------------------------------------------------------------
    // Task
    //-------------------------------------------------------------------------

    grunt.registerMultiTask('vendor', 'Download dependencies via http', function() {
        grunt.log.writeln('\nTarget:', this.target, '\n----------------------');

        var self = this;

        var gruntDone = this.async();
        var options = this.options();
        var params = this.data;
        var target = this.target;

        var realDest = options.dest;
        if (params.dest) {
            grunt.log.writeln("\n\n" + params.dest + "\n\n");
            realDest = params.dest;
        }

        var extractPath = path.join(realDest, self.target);

        //---------------------------------------------------------------------

        function handleFileType(fileUrl, filePath, cb) {
            if(!options.replace && (grunt.file.exists(filePath) || grunt.file.isDir(extractPath))) {
                grunt.log.writeln('  skipping: ' + fileUrl);
                cb();
                return;
            }

            switch(path.extname(filePath).toLowerCase()){
                case '.zip':
                    extractPath = (params.useZipRoot) ? extractPath : extractPath + '/../';
                    unzipFile(fileUrl, extractPath, function(error, zipFiles)
                    {
                        if(params.renameZipRoot && zipFiles[0].isDirectory) {
                            zipRoot = zipFiles[0].entryName;

                            mv(path.join(extractPath, zipRoot),  path.join(realDest, self.target),
                                { mkdirp: true }, function(error) {
                                    if(error) {
                                        grunt.log.error('Error moving zip root:', error);
                                    }

                                    cb(error);
                                });
                        }
                    });

                    break;
                case 'tar.gz':
                    grunt.log.writeln('hmmm.... i should probably implement this');
                    cb();
                    break;
                default:
                    writeFile(fileUrl, filePath, cb);
            }
        };

        //---------------------------------------------------------------------

        // Support a single url parameter that simply downloads the file
        if(params.url) {
            var filePath = path.join(extractPath, path.basename(params.url));
            handleFileType(params.url, filePath, function(error) {
                if(error) {
                    grunt.log.error('Encountered error:', error.stack || error.message || error.toString());
                }

                // If there was an error, return false.
                gruntDone(!error);
            });
            return;
        }

        async.each(params.src, function(filename, done){
                var fileUrl = url.resolve(params.basepath, filename);

                var filePath = path.join(extractPath, filename);

                if(params.token != null) {
                    fileUrl = fileUrl + '?' + params.token
                }

                handleFileType(fileUrl, filePath, done);
            },
            function(error) {
                if(error) {
                    grunt.log.error('Encountered error:', error.stack || error.message || error.toString());
                }

                // If there was an error, return false.
                gruntDone(!error);
            });
    });
};

//-----------------------------------------------------------------------------
