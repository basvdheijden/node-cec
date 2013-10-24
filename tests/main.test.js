var CEC = require('../index');

module.exports = {
  setUp: function(callback) {
    callback();
  },
  tearDown: function(callback) {
    callback();
  },

  restartTest: function(test) {
    test.expect(6);

    var restarted = 0,
        stopped = 0,
        started = 0,
        autostart = false;

    var cec = new CEC(process.cwd() + '/tests/restart.sh', autostart);

    cec.event.on('start', function() {
      started++;
    });

    cec.event.on('stop', function() {
      stopped++;
    });

    cec.event.on('restart', function() {
      restarted++;
    });

    cec.start();

    setTimeout(function() {
      test.ok(stopped === 1, 'The CEC instance should have stopped once within the first 2.5 secs.');
      test.ok(restarted === 1, 'The CEC instance should have restarted itself within the first 2.5 secs.');
      test.ok(started === 2, 'The CEC instance should have started twice within the first 2.5 secs.');
    }, 2500);

    setTimeout(function() {
      test.ok(stopped === 2, 'The CEC instance should have stopped once within the first 5 secs.');
      test.ok(restarted === 2, 'The CEC instance should have restarted itself twice within the first 5 secs.');
      test.ok(started === 3, 'The CEC instance should have started thrice within the first 5 secs.');
      test.done();
    }, 5000);
  }
};