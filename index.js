var five = require('johnny-five');

var board = new five.Board();
board.on('ready', function () {
  var _self = this;
  var startPosition = 0;
  var startDirection = 1;

  var pins = [3, 5, 6, 9, 10];
  var tailLength = 1;

  var getState = function (vector) {
    var state = {
      tail: [],
      on: pins[vector.position]
    };

    state.off = pins.slice(0);
    state.off.splice(state.off.indexOf(state.on), 1);

    var index, i;
    if (vector.direction && vector.position > 0) {
      for (i = 0; i < tailLength; i++) {
        index = vector.position - (i + 1);
        state.tail.push(pins[index]);
        state.off.splice(state.off.indexOf(pins[index]), 1);
      }
    }

    if (!vector.direction && vector.position < pins.length - 1) {
      for (i = 0; i < tailLength; i++) {
        index = vector.position + (i + 1);
        state.tail.push(pins[index]);
        state.off.splice(state.off.indexOf(pins[index]), 1);
      }
    }

    return state;
  };

  var renderState = function (state) {
    five.Leds(state.off).off();
    five.Leds(state.tail).brightness(30);
    five.Led(state.on).on();
  };

  var getNextVector = function (vector) {
    var newVector = {
      direction: vector.direction
    };

    if (vector.direction) {
      newVector.position = vector.position + 1;
    } else {
      newVector.position = vector.position - 1;
    }

    if (newVector.position > pins.length - 1) {
      newVector.position = pins.length - 2;
      newVector.direction = 0;
    }

    if (newVector.position < 0) {
      newVector.position = 1;
      newVector.direction = 1;
    }

    return newVector;
  };

  var next = function(vector) {
    var state = getState(vector);
    renderState(state);

    _self.wait(150, function () {
      next(getNextVector(vector));
    });
  };

  next({
    position: startPosition, 
    direction: startDirection
  });
});
