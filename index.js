"use strict";

//var stylint = require('stylint');
var through = require('through');
var gulpUtil = require('gulp-util');
var pluginError = gulpUtil.PluginError;
var shell = require('shelljs');
var map = require('map-stream');

var stylinPlugin = function(pluginOptions) {

    if (!pluginOptions) {
        pluginOptions = {};
    }
    return map(function(file, cb){
        var cmd = 'stylint ' + file.history + ' -c ' + pluginOptions.configuration;
        shell.exec(cmd).output;
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