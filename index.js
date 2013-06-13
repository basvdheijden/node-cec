var exec = require('child_process').exec,
    CEC = require('./lib/cec');

var child = exec('cec-client');
var cec = new CEC(child.stdout);

cec.event.on('key', function(k) {
  console.log(k);
});