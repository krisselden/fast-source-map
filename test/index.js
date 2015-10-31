QUnit.module('test encode');

function toString(buffer, offset, len) {
  var str = '';
  for (var i=offset; i<len; i++) {
    str += String.fromCharCode(buffer[i]);
  }
  return str;
}

function toBuffer(str) {
  var buffer = new Uint8Array(str.length);
  for (var i=0; i<buffer.length; i++) {
    // this is for base64 so we know these are all < 123
    buffer[i] = str.charCodeAt(i)|0;
  }
  return buffer;
}

QUnit.test('encodeVLQ', function (assert) {
  var output = [];
  var pos = 0;
  var buffer = [123,456,789,987,654,321];
  var input = new VLQ.IntBufferReader(buffer, 0, buffer.length);
  var output = new VLQ.IntBufferWriter([], 0);

  [123,456,789,987,654,321].forEach(function (n) {
    VLQ.encodeVLQ(output, n);
  });

  assert.deepEqual(toString(output.buf, 0, output.ptr), '2HwcqxB29B8oBiU');

  output = new VLQ.IntBufferWriter(new Int32Array(10), 0);

  [-1,2,1,7,-1,2,6,2].forEach(function (n) {
    VLQ.encodeVLQ(output, n);
  });
  assert.deepEqual(toString(output.buf, 0, output.ptr), 'DECODEME');
});

QUnit.test('decodeVLQ', function (assert) {
  var output = {
    buf: new Int32Array(10),
    ptr: 0
  };
  var input = {
    buf: toBuffer('DECODEME'),
    ptr: 0
  };
  while (input.ptr < input.buf.length) {
    output.buf[output.ptr++] = VLQ.decodeVLQ(input);
  }
  assert.deepEqual(output.buf, new Int32Array([-1,2,1,7,-1,2,6,2, 0,0]));
  assert.equal(output.ptr, 8);
});

QUnit.test('mappings decoder', function (assert) {
  var buffer = toBuffer('uLAOA,SAASA,GAAcC,EAAMC,EAAIC,GACjC,OAAUF,GACV,IAAS,SAAT,MAA0B,IAAIG,GAAOF,EAAIC,EAAzC,KACS,cAAT,MAA+B');

  var reader = new VLQ.IntBufferReader(buffer, 0, buffer.length);

  var currentLine = {
    mappings: []
  };
  var mappings = { lines: [currentLine] };

  var decoder = new VLQ.MappingsDecoder({
    newline: function () {
      currentLine = { mappings: [] };
      mappings.lines.push(currentLine);
    },
    mapping1: function (col) {
      currentLine.mappings.push({ col: col });
    },
    mapping4: function (col, src, srcLine, srcCol) {
      currentLine.mappings.push({ col: col, src: src, srcLine: srcLine, srcCol: srcCol });
    },
    mapping5: function (col, src, srcLine, srcCol, name) {
      currentLine.mappings.push({ col: col, src: src, srcLine: srcLine, srcCol: srcCol, name: name });
    }
  });

  decoder.decode(reader);

  assert.deepEqual(mappings, {
    lines: [{
      mappings: [{ col: 183, src: 0, srcLine: 7, srcCol: 0 },
                 { col: 192, src: 0, srcLine: 7, srcCol: 9, name: 0 },
                 { col: 195, src: 0, srcLine: 7, srcCol: 23, name: 1 },
                 { col: 197, src: 0, srcLine: 7, srcCol: 29, name: 2 },
                 { col: 199, src: 0, srcLine: 7, srcCol: 33, name: 3 },
                 { col: 202, src: 0, srcLine: 8, srcCol: 0 },
                 { col: 209, src: 0, srcLine: 8, srcCol: 10, name: 1 },
                 { col: 212, src: 0, srcLine: 9, srcCol: 0},
                 { col: 216, src: 0, srcLine: 9, srcCol: 9},
                 { col: 225, src: 0, srcLine: 9, srcCol: 0},
                 { col: 231, src: 0, srcLine: 9, srcCol: 26},
                 { col: 235, src: 0, srcLine: 9, srcCol: 30, name: 4 },
                 { col: 238, src: 0, srcLine: 9, srcCol: 37, name: 2 },
                 { col: 240, src: 0, srcLine: 9, srcCol: 41, name: 3 },
                 { col: 242, src: 0, srcLine: 9, srcCol: 0},
                 { col: 247, src: 0, srcLine: 10, srcCol: 9},
                 { col: 261, src: 0, srcLine: 10, srcCol: 0},
                 { col: 267, src: 0, srcLine: 10, srcCol: 31}]
    }]
  });
});
