var Stream = require('stream'),
  Event = require('events').EventEmitter;

var CEC = function(inputStream) {
  var self = this;

  this.inputStream = inputStream;

  this.stream = new Stream();
  this.stream.writable = true;

  this.event = new Event();

  this.stream.write = function(buffer) {
    var data = buffer.toString();
    console.log(data);
    var matches = data.match(/key pressed: (.+) \(0\)/);
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