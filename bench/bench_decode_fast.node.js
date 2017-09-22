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

var result = test(); // actual test run
var decoded = result.decoded;
console.log('warm run:', result.duration + 'ms'); // warm up

// make sure the output appears reasonable
assert(decoded.mappings.length === 379201, 'correct number of mappings')
assert.deepEqual(decoded.mappings[0],
  [
    { fieldCount: 4, col: 0, src: 0, srcLine: 0, srcCol: 0, name: 0 },
  ],
);
assert.deepEqual(decoded.mappings[379200], []);

function doTest(i) {
  return () => delay(500).then(() => {
    console.log(`run ${i}: ${test().duration}ms`);
  });
}

let chain = Promise.resolve();
for (let i = 0; i < 20; i++) {
  chain.then(doTest(i + 1))
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (typeof gc === 'function') gc(true);
      setTimeout(resolve, ms);
    }, 10);
  });
}
