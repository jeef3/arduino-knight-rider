var five = require('johnny-five');

var board = new five.Board();
board.on('ready', function () {
  var _self = this;
  var direction = 1;
  var pins = [3, 5, 6, 9, 10];
  var tailLength = 1;

  var getState = function (curr) {
    var state = {
      tail: [],
      on: pins[curr]
    };

    state.off = pins.slice(0);
    state.off.splice(state.off.indexOf(state.on), 1);

    var index, i;
    if (direction && curr > 0) {
      for (i = 0; i < tailLength; i++) {
        index = curr - (i + 1);
        state.tail.push(pins[index]);
        state.off.splice(state.off.indexOf(pins[index]), 1);
      }
    }

    if (!direction && curr < pins.length - 1) {
      for (i = 0; i < tailLength; i++) {
        index = curr + (i + 1);
        state.tail.push(pins[index]);
        state.off.splice(state.off.indexOf(pins[index]), 1);
      }
    }

    return state;
  };

  var move = function(curr) {
    var state = getState(curr);

    five.Leds(state.off).off();
    five.Leds(state.tail).brightness(30);
    five.Led(state.on).on();

    _self.wait(150, function () {
      var shift;
      if (direction) {
        shift = curr + 1;
      } else {
        shift = curr - 1;
      }

      if (shift > pins.length - 1) {
        shift = pins.length - 2;
        direction = 0;
      }

      if (shift < 0) {
        shift = 1;
        direction = 1;
      }

      move(shift);
    });
  };

  move(0);
});
