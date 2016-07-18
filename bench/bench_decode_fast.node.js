var fs = require('fs');
var decode = require('../lib/decode').decode;
var MappingsDecoder = require('../lib/mappings-decoder').default;
var IntBufferReader = require('../lib/int-buffer-reader').default;
var toBuffer = require('../lib/utils/to-buffer').default;
var assert = require('assert');

var sourcemap = fs.readFileSync('bench/scala.js.map', 'utf8');

assert(typeof sourcemap === 'string', 'no buffer');

function test1() {
  var parsed = JSON.parse(sourcemap);
  var start = Date.now();

  var decoded = decode(parsed);

  return {
    duration: Date.now() - start,
    decoded: decoded
  }
}

function toBufferWithStats(str) {
  var buffer = new Uint8Array(str.length);
  var lines = 0;
  var fields = 0;
  var l = 0;
  for (var i = 0; i < buffer.length; i++) {
      // this is for base64 so we know these are all < 123
      var c = str.charCodeAt(i) | 0;
      if (c === 59) {
        lines++;
      } else if (l === 59 || l === 44) {
        fields++;
      }
      buffer[i] = c;
      l = c;
  }
  return {
    buffer: buffer,
    lines: lines,
    fields: fields
  };
}

function NewDelegate(lineCount, fieldCount) {
  this.linesCount = lineCount;
  this.lines = new Int32Array(lineCount + 1);
  this.linesPtr = 1; // zero in lines already
  this.buffer = new Int32Array(lineCount + 1 + fieldCount * 6 + 6);
  this.ptr = 1; // zero in buffer already
  // current line
  this.startPtr = 0;
  this.mappings = 0;
}

NewDelegate.prototype.newline = function () {
  this.lines[this.linesPtr++] = this.ptr;
  this.startPtr = this.ptr;
  this.ptr++; // 0 in buffer already
};

NewDelegate.prototype.mapping1 = function (c) {
  this.mappings++;
  this.buffer[this.ptr++] = 1;
  this.buffer[this.ptr++] = c | 0;
  this.ptr += 4;
  this.buffer[this.startPtr]++; // increment mapping count
};

NewDelegate.prototype.mapping4 = function (c, s, sl, sc) {
  this.mappings++;
  this.buffer[this.ptr++] = 4;
  this.buffer[this.ptr++] = c | 0;
  this.buffer[this.ptr++] = s | 0;
  this.buffer[this.ptr++] = sl | 0;
  this.buffer[this.ptr++] = sc | 0;
  this.ptr += 1;
  this.buffer[this.startPtr]++; // increment mapping count
};

NewDelegate.prototype.mapping5 = function (c, s, sl, sc, n) {
  this.mappings++;
  this.buffer[this.ptr++] = 5;
  this.buffer[this.ptr++] = c | 0;
  this.buffer[this.ptr++] = s | 0;
  this.buffer[this.ptr++] = sl | 0;
  this.buffer[this.ptr++] = sc | 0;
  this.buffer[this.ptr++] = n | 0;
  this.buffer[this.startPtr]++; // increment mapping count
};

var delegate;
var decoder;

function test2() {
  var parsed = JSON.parse(sourcemap);

  var stats = toBufferWithStats(parsed.mappings);
  var buffer = stats.buffer;

  var start = Date.now();
  global.reader = new IntBufferReader(buffer, 0, buffer.length);

  var lineIndex = 0;
  var index = 0;
  var fieldCountIndex = 0;
  var fieldCount = 0;

  var lines = new Int32Array(stats.lines);
  fieldCountIndex = index;
  lines[lineIndex++] = index;

  delegate = new NewDelegate(stats.lines, stats.fields);

  decoder = new MappingsDecoder(delegate);


  decoder.decode(reader);

  // 1 length per line and 1 length per field
  var decoded = {
    lines: delegate.lines,
    buffer: delegate.buffer
  };

  return {
    duration: Date.now() - start,
    decoded: decoded
  }
}

var test;
var result;

function warm1() {
  test = test1;
  result = test1(); // actual test run
  var decoded = result.decoded;
  console.log('warm:', result.duration + 'ms'); // actual run

  // make sure the output appears reasonable
  assert(decoded.mappings.lines.length === 379201, 'correct number of mappings')
  assert.deepEqual(decoded.mappings.lines[0], {
    mappings: [
      { fieldCount: 4, col: 0, src: 0, srcLine: 0, srcCol: 0, name: undefined },
    ],
  });

  assert.deepEqual(decoded.mappings.lines[379200], {
    mappings: [ ]
  });
}

function warm2() {
  test = test2;
  result = test2(); // actual test run
  var decoded = result.decoded;
  console.log('warm:', result.duration + 'ms'); // actual run

  // make sure the output appears reasonable

  // assert(decoded.length === 379201, 'correct number of mappings '+ decoded.length)
  // assert.deepEqual(decoded[0], [[4, 0, 0, 0, 0, 0]]);
  // assert.deepEqual(decoded[379200], []);
}

var count = 30;

warm1();

gc();

function interation() {
  result = test();
  console.log('run ' + count + ':', result.duration + 'ms');
  count--;
  if (count) {
    gc();

    setTimeout(interation, 100);
  }
}

setTimeout(interation, 100);
