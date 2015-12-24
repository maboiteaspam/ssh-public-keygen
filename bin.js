#!/usr/bin/env node

function usage () {/*

    Usage
        ssh-public-keygen [opts]

    Options
        -v             verbose
        -h             show help

    Examples
        ssh-public-keygen -v
        ssh-public-keygen -h
*/}

var argv  = require('minimist')(process.argv.slice(2));
var debug = require('@maboiteaspam/set-verbosity')('ssh-public-keygen', process.argv);
var pkg   = require('./package.json')
var help  = require('@maboiteaspam/show-help')(usage, process.argv, pkg);

// (!argv['_'] || !!argv['_']) && help.print(usage, pkg) && help.die();
