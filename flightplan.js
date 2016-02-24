var plan = require('flightplan');
var nconf = require('nconf');

nconf.argv().env().file({ file: 'config.json' });

plan.target('production', {
  host: nconf.get('application:servers:rps:host'),
  port: nconf.get('application:servers:rps:port'),
  username: nconf.get('application:servers:rps:username'),
  agent: process.env.SSH_AUTH_SOCK
});

var appDir = 'rps-control';
var tmpDir = appDir  + new Date().getTime();

// run commands on localhost
plan.local('deploy', function(local) {

  // compile assets
  local.log('Run build');
  local.exec('webpack --progress --colors');

  // confirm deployment to production, as we don't want to do this accidentally
  if(plan.runtime.target === 'production') {
    var input = local.prompt('Ready for deploying to production? [yes]');
    if(input.indexOf('yes') === -1) {
      local.abort('user canceled flight'); // this will stop the flightplan right away.
    }
  }

  // rsync files to all the target's hosts
  local.log('Copy files to remote hosts');
  var filesToCopy = local.exec('git ls-files', {silent: true});
  local.transfer(filesToCopy, '/tmp/' + tmpDir);

  local.log('Copy config file');
  local.transfer('config.json', '/tmp/' + tmpDir);
});

// run commands on the target's remote hosts
plan.remote('deploy', function(remote) {
  var user = plan.runtime.target.username;

  remote.log('Stopping application');
  remote.failsafe();
  remote.sudo('forever --sourceDir ~/' + appDir + ' stop server.js', {user: user});
  remote.unsafe();

  remote.log('Move folder to web root');
  remote.sudo('cp -R /tmp/' + tmpDir + ' ~', {user: user});
  remote.sudo('mv ~/' + tmpDir + ' ~/' + appDir, {user: user});
  remote.rm('-rf /tmp/' + tmpDir);

  remote.log('Install dependencies');
  remote.sudo('npm --production --prefix ~/' + appDir
                            + ' install ~/' + appDir, {user: user});

  remote.log('Reload application with forever');
  remote.sudo('forever --sourceDir ~/' + appDir + ' start server.js', {user: user});
});