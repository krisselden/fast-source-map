var fs = require('fs');
var decode = require('../dist/index').decode;
var assert = require('assert');

function test() {
  var parsed = JSON.parse(fs.readFileSync('bench/scala.js.map', 'utf8'));
  var start = Date.now();
  var decoded = decode(parsed);

  return {
    duration: Date.now() - start,
    decoded: decoded,
  }
}

console.log('first run:', test().duration + 'ms'); // warm up

// let the world settle down
setTimeout(function() {
  var result = test(); // actual test run
  var decoded = result.decoded;
  console.log('second run:', result.duration + 'ms'); // actual run

  // make sure the output appears reasonable
  assert(decoded.mappings.length === 379201, 'correct number of mappings')
  assert.deepEqual(decoded.mappings[0],
    [
      { fieldCount: 4, col: 0, src: 0, srcLine: 0, srcCol: 0, name: 0 },
    ],
  );
  assert.deepEqual(decoded.mappings[379200], []);
}, 100);
