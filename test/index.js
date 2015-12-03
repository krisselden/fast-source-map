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

function Decoder() {
  this.currentLine = {
    mappings: []
  };

  this.mappings = {
    lines: [this.currentLine]
  };
}

Decoder.prototype = {
    newline: function () {
      this.currentLine = { mappings: [] };
      this.mappings.lines.push(this.currentLine);
    },

    mapping1: function (col) {
      this.currentLine.mappings.push({
        col: col,
        src: undefined,
        srcLine: undefined,
        srcCol: undefined,
        name: undefined
      });
    },

    mapping4: function (col, src, srcLine, srcCol) {
      this.currentLine.mappings.push({
        col: col,
        src: src,
        srcLine: srcLine,
        srcCol: srcCol,
        name: undefined
      });
    },

    mapping5: function (col, src, srcLine, srcCol, name) {
      this.currentLine.mappings.push({
        col: col,
        src: src,
        srcLine: srcLine,
        srcCol: srcCol,
        name: name
      });
    }
};

QUnit.test('mappings decoder', function (assert) {
  var buffer = toBuffer('uLAOA,SAASA,GAAcC,EAAMC,EAAIC,GACjC,OAAUF,GACV,IAAS,SAAT,MAA0B,IAAIG,GAAOF,EAAIC,EAAzC,KACS,cAAT,MAA+B');

  var reader = new VLQ.IntBufferReader(buffer, 0, buffer.length);

  var decoder = new Decoder();
  var mappingsDecoder = new VLQ.MappingsDecoder(decoder).decode(reader);

  assert.deepEqual(decoder.mappings, {
    lines: [{
      mappings: [{ col: 183, src: 0, srcLine: 7,  srcCol: 0,  name: undefined },
                 { col: 192, src: 0, srcLine: 7,  srcCol: 9,  name: 0 },
                 { col: 195, src: 0, srcLine: 7,  srcCol: 23, name: 1 },
                 { col: 197, src: 0, srcLine: 7,  srcCol: 29, name: 2 },
                 { col: 199, src: 0, srcLine: 7,  srcCol: 33, name: 3 },
                 { col: 202, src: 0, srcLine: 8,  srcCol: 0,  name: undefined },
                 { col: 209, src: 0, srcLine: 8,  srcCol: 10, name: 1 },
                 { col: 212, src: 0, srcLine: 9,  srcCol: 0,  name: undefined },
                 { col: 216, src: 0, srcLine: 9,  srcCol: 9,  name: undefined },
                 { col: 225, src: 0, srcLine: 9,  srcCol: 0,  name: undefined },
                 { col: 231, src: 0, srcLine: 9,  srcCol: 26, name: undefined },
                 { col: 235, src: 0, srcLine: 9,  srcCol: 30, name: 4 },
                 { col: 238, src: 0, srcLine: 9,  srcCol: 37, name: 2 },
                 { col: 240, src: 0, srcLine: 9,  srcCol: 41, name: 3 },
                 { col: 242, src: 0, srcLine: 9,  srcCol: 0,  name: undefined },
                 { col: 247, src: 0, srcLine: 10, srcCol: 9,  name: undefined },
                 { col: 261, src: 0, srcLine: 10, srcCol: 0,  name: undefined },
                 { col: 267, src: 0, srcLine: 10, srcCol: 31, name: undefined }]
    }]
  });
});

QUnit.test('mappings decoder (another)', function (assert) {
  var buffer = toBuffer(',YAAY;;AAArB,WAAS,YAAY,CAAC,IAAI,EAAE,MAAM,EAAE;AACjD,QAAI,KAAK,GAAG,CAAC,CAAC;AACd,QAAI,GAAG,GAAG,MAAM,CAAC,MAAM,GAAG,CAAC,CAAC;AAC5B,QAAI,MAAM,EAAE,CAAC,CAAC;;AAEd,WAAO,KAAK,GAAG,GAAG,EAAE;;;AAGlB,OAAC,GAAG,CAAC,GAAG,GAAG,KAAK,CAAA,GAAI,CAAC,CAAC;;;;AAItB,YAAM,GAAG,KAAK,GAAG,CAAC,GAAI,CAAC,GAAG,CAAC,AAAC,CAAC;;AAE7B,UAAI,IAAI,IAAI,MAAM,CAAC,MAAM,CAAC,EAAE;AAC1B,aAAK,GAAG,MAAM,GAAG,CAAC,CAAC;OACpB,MAAM;AACL,WAAG,GAAG,MAAM,CAAC;OACd;KACF;;AAED,WAAO,AAAC,IAAI,IAAI,MAAM,CAAC,KAAK,CAAC,GAAI,KAAK,GAAG,CAAC,GAAG,KAAK,CAAC;GACpD');

  var decoder = new Decoder();
  var reader = new VLQ.IntBufferReader(buffer, 0, buffer.length);

  new VLQ.MappingsDecoder(decoder).decode(reader);

  var mappings = decoder.mappings;

  assert.equal(mappings.lines.length, 25, 'mappings.lines.length');
  assert.equal(mappings.lines[0].mappings.length, 1);
  assert.deepEqual(mappings.lines[0].mappings[0], { srcLine: 0, srcCol: 12, src: 0, col: 12, name: undefined }, 'YAAY');

  assert.equal(mappings.lines[1].mappings.length, 0);
  assert.equal(mappings.lines[2].mappings.length, 8);

  assert.deepEqual(mappings.lines[2].mappings[0], { srcLine: 0, srcCol: -9, src: 0, col:  0, name: undefined }, 'AAArB');
  assert.deepEqual(mappings.lines[2].mappings[1], { srcLine: 0, srcCol:  0, src: 0, col: 11, name: undefined }, 'WAAS');
  assert.deepEqual(mappings.lines[2].mappings[2], { srcLine: 0, srcCol: 12, src: 0, col: 23, name: undefined }, 'YAAY');
  assert.deepEqual(mappings.lines[2].mappings[3], { srcLine: 0, srcCol: 13, src: 0, col: 24, name: undefined }, 'CAAC');
  assert.deepEqual(mappings.lines[2].mappings[4], { srcLine: 0, srcCol: 17, src: 0, col: 28, name: undefined }, 'IAAI');
  assert.deepEqual(mappings.lines[2].mappings[5], { srcLine: 0, srcCol: 19, src: 0, col: 30, name: undefined }, 'EAAE');
});
