"use strict";
var fs = require('fs');
var decode = require('../dist/index').decode;
var assert = require('assert');

var sourceMap = fs.readFileSync('bench/scala.js.map', 'utf8');

function test() {
  var parsed = JSON.parse(sourceMap);
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

function doTest(chain, i) {
  return chain.then(() => delay(10)).then(runGC).then(() => delay(500)).then(() => {
    console.log(`run ${i}`);
    const result = test();
    console.log(`${result.duration}ms`);
  });
}

let chain = Promise.resolve();
for (let i = 0; i < 20; i++) {
  chain = doTest(chain, i + 1);
}

function runGC() {
  if (typeof gc === 'function') {
    // console.log('full gc...');
    gc(true);
    // console.log('done');
  }
}

function delay(ms) {
  // console.log(`delay ${ms}`);
  return new Promise(resolve => setTimeout(resolve, ms));
}
