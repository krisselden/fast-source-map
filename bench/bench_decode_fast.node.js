var fs = require('fs');
var VLQ = require('../');
var toBuffer = require('string2buffer');

var parsedSourceMap = JSON.parse(fs.readFileSync('bench/scala.js.map'));

var mappings = {
  lines: [],
};

var currentLine = { mappings: [] };
var decoder = new VLQ.MappingsDecoder({
  newline: function () {
    currentLine = { mappings: [] };
    mappings.lines.push(currentLine);
  },

  mapping1: function (col) {
    currentLine.mappings.push({ col: col });
  },

  mapping4: function (col, src, srcLine, srcCol) {
    currentLine.mappings.push({
    col: col,
    src: src,
    srcLine: srcLine,
    srcCol: srcCol
    });
  },

  mapping5: function (col, src, srcLine, srcCol, name) {
    currentLine.mappings.push({
      col: col,
      src: src,
      srcLine: srcLine,
      srcCol: srcCol,
      name: name
    });
  }
});

var start = Date.now();
var buffer = toBuffer(parsedSourceMap.mappings);
var reader = new VLQ.IntBufferReader(buffer, 0, buffer.length);

decoder.decode(reader);

mappings.lines.forEach(function() { });
console.log(Date.now() - start);
