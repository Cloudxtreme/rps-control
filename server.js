var nconf = require('nconf');
var express = require('express');
var exApp = express();

nconf.argv().env().file({ file: 'config.json' });

var port = nconf.get('application:port') || 3000;
var host = null;

exApp.use(express.static('build'));

exApp.get('/', function (req, res) {
  res.sendFile('/index.html');
});

var server = exApp.listen(port, host, null, function() {
  console.log('listening on port', port);
});