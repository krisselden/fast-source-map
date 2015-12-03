var fs = require('fs');
var VLQ = require('../');

function toBuffer(str) {
  var buffer = new Uint8Array(str.length);
  for (var i=0; i<buffer.length; i++) {
    // this is for base64 so we know these are all < 123
    buffer[i] = str.charCodeAt(i)|0;
  }
  return buffer;
}

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
