var SourceMapConsumer = require('../vendor/source-map/source-map.js').SourceMapConsumer;
var fs = require('fs');

var samples = new Float32Array(32);
var parsedSourceMap = JSON.parse(fs.readFileSync('bench/scala.js.map'));

var start = Date.now();
var sourceMapConsumer = new SourceMapConsumer(parsedSourceMap);
sourceMapConsumer.eachMapping(function () {});
var elasped = Date.now() - start;

console.log(elasped);
