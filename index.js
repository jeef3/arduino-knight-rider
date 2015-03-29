var five = require('johnny-five');

var board = new five.Board();
board.on('ready', function () {
  var _self = this;
  var direction = 1;
  var pins = [3, 5, 6, 9, 10];
  var pos = 4;

  var nextPos = function (curr) {
    var pos = {
      half: [],
      on: pins[curr]
    };

    pos.off = pins.slice(0);
    pos.off.splice(pos.off.indexOf(pos.on), 1);

    if (curr > 0) {
      pos.half.push(pins[curr - 1]);
      pos.off.splice(pos.off.indexOf(pins[curr - 1]), 1);
    }

    if (curr < pins.length - 1) {
      pos.half.push(pins[curr + 1]);
      pos.off.splice(pos.off.indexOf(pins[curr + 1]), 1);
    }

    return pos;
  };

  var move = function(curr) {
    var pos = nextPos(curr);

    console.log('curr', curr, 'pos', pos);
    five.Leds(pos.off).off();
    five.Leds(pos.half).brightness(10);
    five.Led(pos.on).on();

    _self.wait(200, function () {
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
