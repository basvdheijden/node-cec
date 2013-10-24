var Stream = require('stream'),
  debug = require('debug')('cec'),
  Event = require('events').EventEmitter,
  spawn = require('child_process').spawn;

var CEC = function(inputStream) {
  debug('Spawning new CEC instance...');
  var self = this;

  if (!inputStream) {
    var child = spawn('cec-client', ['-o', '"Mieris.com"']);
    inputStream = child.stdout;
  }

  this.inputStream = inputStream;

  this.stream = new Stream();
  this.stream.writable = true;

  this.event = new Event();

  this.stream.write = function(buffer) {
    debug('Data written to CEC stream');
    var data = buffer.toString();
    var matches = data.match(/key pressed: ([^\s]+)/);
    if (matches && matches.length > 1) {
      debug('Emitting key event: %s', matches[1]);
      self.event.emit('key', matches[1]);
    }
  };

  this.stream.end = function(buffer) {
    debug('Ending CEC stream..');
    if (buffer) {
      this.write(buffer);
    }

    this.writable = false;
  };

  this.inputStream.pipe(this.stream);

  return this;
};

module.exports = exports = CEC;
