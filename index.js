var Stream = require('stream'),
  debug = require('debug')('cec'),
  Event = require('events').EventEmitter,
  spawn = require('child_process').spawn,
  exec = require('child_process').exec;

var CEC = function(cecClient, autostart) {
  var self = this;
  this.event = new Event();
  this.cecClient = cecClient || 'cec-client';
  if (typeof autostart !== 'undefined') {
    this.autostart = autostart;
  }
  else {
    this.autostart = true;
  }

  this.start = function() {
    this.event.emit('start');

    debug('Spawning new CEC instance...');
    this.child = spawn(this.cecClient, ['-o', '"Mieris.com"']);
    this.inputStream = this.child.stdout;
    this.stream = new Stream();
    this.stream.writable = true;
    this.inputStream.pipe(this.stream);

    this.stream.write = function(buffer) {
      debug('Data written to CEC stream');
      var data = buffer.toString();
      var matches = data.match(/key pressed: (.+)\s\(/);
      if (matches && matches.length > 1) {
        debug('Emitting key event: %s', matches[1]);
        self.event.emit('key', matches[1]);
      }
      else if (data.match(/destination device '(.+)' marked as not present/)) {
        // Restart CEC
        self.restart();
      }
    };

    this.stream.end = function(buffer) {
      debug('Ending CEC stream..');
      if (buffer) {
        this.write(buffer);
      }

      this.writable = false;
    };

  };

  this.stop = function() {
    debug('Stopping CEC');
    this.event.emit('stop');

    this.child.kill('SIGINT');
    exec('killall -9 cec-client');
    this.child = null;
  };

  this.restart = function() {
    debug('Restarting CEC');
    this.event.emit('restart');

    this.stop();
    this.start();
  };

  if (this.autostart) {
    this.start();
  }

  return this;
};

module.exports = exports = CEC;
