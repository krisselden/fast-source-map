var exports = {};
load('vendor/source-map/source-map.js');
var SourceMapConsumer = exports.sourceMap.SourceMapConsumer;

var samples = new Float32Array(32);
var parsedSourceMap = JSON.parse(read('bench/scala.js.map'));

var start = performance.now();
var sourceMapConsumer = new SourceMapConsumer(parsedSourceMap);
sourceMapConsumer.eachMapping(function () {});
var elasped = performance.now() - start;

print(elasped);
