"use strict";

var through = require('through');
var gulpUtil = require('gulp-util');
var pluginError = gulpUtil.PluginError;
var process = require('child_process');
var map = require('map-stream');

var stylinPlugin = function(pluginOptions) {

    if (!pluginOptions) {
        pluginOptions = {};
    }
    return map(function(file, cb){
        // FIXME why `history` ???
        var cmdArguments = [file.history];

        if (file.isStream()) {
            return cb(new pluginError('gulp-stylint', 'Streaming not support'));
        }

        if (pluginOptions.configuration) {
            cmdArguments.push(' -c ' + pluginOptions.configuration);
        }

        var linter = process.spawn('stylint', cmdArguments);

        linter.stdout.on('data', function(data){
            console.log('[warning] gulp-stylint', data.toString());
        });

        linter.stderr.on('data', function(data) {
            console.log('[error] gulp-stylint', data.toString());
        });

        linter.on('close', function(exitCode) {
            cb();
        });
    });
};

stylinPlugin.report = function(reporter, options) {
    var reportFailures = function(file) {

        this.emit('data', file);
    };

    var throwErrors = function() {
        this.emit('end');
    };

    return through(reportFailures);
};

module.exports = stylinPlugin;