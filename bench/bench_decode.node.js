var SourceMapConsumer = require('../vendor/source-map/source-map.js').SourceMapConsumer;
var fs = require('fs');

function test() {
  var parsedSourceMap = JSON.parse(fs.readFileSync('bench/scala.js.map'));

  var start = Date.now();
  var sourceMapConsumer = new SourceMapConsumer(parsedSourceMap);
  sourceMapConsumer.eachMapping(function () {});

  return {
    decoded: sourceMapConsumer,
    duration: Date.now() - start,
  };
}

console.log('first run:', test().duration + 'ms'); // prime
setTimeout(function() {
  console.log('second run:', test().duration + 'ms');
});
