#!/usr/bin/env node

function usage () {/*

    Usage
        ssh-public-keygen [ssh hosts]
        ssh-public-keygen [ssh hosts]

    Options
        [ssh hosts]       Is a string such [host1 pwd1 host2 pwd2] (You would not use space in user / pwd, would you ?)
        -v                verbose
        -h                show help
        -t|--type         one of dsa | ecdsa | ed25519 | rsa | rsa1
        -y|--yes          add --yes flag
        -y|--yes          add -y flag
        -f|--file         Which file to save the key to, default is ~/.ssh/id_rsa' + [YYYYMMDD_HHMMSS]
        -p|--passphrase   your passphrase, default is empty.
        -c|--comment      Comment of the key, default is 'created with '+pkg.name+''.

    Examples
        ssh-public-keygen -v
        ssh-public-keygen -h
*/}


var argv  = require('minimist')(process.argv.slice(2));
var debug = require('@maboiteaspam/set-verbosity')('ssh-public-keygen', process.argv);
var pkg   = require('./package.json')
var help  = require('@maboiteaspam/show-help')(usage, process.argv, pkg);
var moment = require('moment');

debug('%j', argv['_']);

(!argv['_'] || !argv['_'].length) && help.print(usage, pkg) && help.die("Missing hosts");

var sshHostParse = require('@maboiteaspam/ssh-host-parse');

var hosts = []
do{
  var host = sshHostParse(argv['_'].shift());
  host.password = argv['_'].shift()
  hosts.push(host)
} while(argv['_'].length);

debug('%j', hosts);
console.log('Found %s host(s)', hosts.length)

var SSH2Utils = require('ssh2-utils');
var ssh = new SSH2Utils();


process.stdin.setEncoding('utf8');

hosts.forEach(function (host) {

  var cmd = "ssh-keygen"
  // -f output_keyfile
  if (argv.t||argv.type) {
    cmd += ' -t ' + (argv.t||argv.type)
  }
  if (argv.y||argv.yes) {
    cmd += ' -y'
  }
  if (argv.f||argv.file) {
    cmd += ' -f \'' + (argv.f||argv.file) + '\''
  } else {
    cmd += ' -f ~/.ssh/id_rsa'+moment().format('YYYYMMDD_HHMMSS')
  }
  if (argv.p||argv.passphrase) {
    cmd += ' -N ' + (argv.p||argv.passphrase)
  } else {
    cmd += ' -N \'\''
  }
  if (argv.c||argv.comment) {
    cmd += ' -C \'' + (argv.c||argv.comment) + '\''
  } else {
    cmd += ' -C \'created with '+pkg.name+'\'' // could put more here
  }
  debug('%s', cmd);

  ssh.run(host, [cmd], function(err, stdout, stderr, server, conn){
    if(err) console.log(err);

    stdout.on('data', function(data){
      data = data+'';
      if (data.match(/Overwrite \(y\/n\)\?/)) {
        process.stdin.resume();
        process.stdin.once('data', function (data) { // note stdin will send it once user press <Enter>
          debug('stdin %s', data)
          stdout.write(data)
          process.stdin.pause();
        })
      }
      debug('stdout %s', data)
    });
    stderr.on('data', function(data){
      debug('stderr %s', data)
    });
    stdout.on('close',function(){
      console.log('All done')
      conn.end();
    });
  }, function(err){if(err) console.error('host %j had error: %s', host, err.message);});
})
