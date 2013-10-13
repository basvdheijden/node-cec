var Stream = require('stream'),
  Event = require('events').EventEmitter,
  exec = require('child_process').exec;

var CEC = function(inputStream) {
  var self = this;

  if (!inputStream) {
    var child = exec('cec-client -o "Mieris.com"');
    inputStream = child.stdout;
  }

  this.inputStream = inputStream;

  this.stream = new Stream();
  this.stream.writable = true;

  this.event = new Event();

  this.stream.write = function(buffer) {
    var data = buffer.toString();
    var matches = data.match(/key pressed: ([^\s]+)/);
    if (matches && matches.length > 1) {
      self.event.emit('key', matches[1]);
    }
  };

  this.stream.end = function(buffer) {
    if (buffer) {
      this.write(buffer);
    }

    this.writable = false;
  };

  this.inputStream.pipe(this.stream);

  return this;
};

module.exports = exports = CEC;
