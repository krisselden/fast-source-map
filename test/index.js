var expect = require('chai').expect;
var VLQ = require('../index');

var toBuffer = require('string2buffer');
var toString = toBuffer.bufferToString;

describe('test encode', function() {
  it('encodeVLQ', function() {
    var output = [];
    var pos = 0;
    var buffer = [ 123,456,789,987,654,321 ];
    var input = new VLQ.IntBufferReader(buffer, 0, buffer.length);
    var output = new VLQ.IntBufferWriter([], 0);

    [ 123,456,789,987,654,321 ].forEach(function (n) {
      VLQ.encodeVLQ(output, n);
    });

    expect(toString(output.buf, 0, output.ptr)).to.equal('2HwcqxB29B8oBiU');

    output = new VLQ.IntBufferWriter(new Int32Array(10), 0);

    [ -1,2,1,7,-1,2,6,2 ].forEach(function (n) {
      VLQ.encodeVLQ(output, n);
    });
    expect(toString(output.buf, 0, output.ptr)).to.equal('DECODEME');
  });

  it('decodeVLQ', function() {
    var output = {
      buf: new Int32Array(10),
      ptr: 0,
    };
    var input = {
      buf: toBuffer('DECODEME'),
      ptr: 0,
    };
    while (input.ptr < input.buf.length) {
      output.buf[output.ptr++] = VLQ.decodeVLQ(input);
    }
    expect(output.buf).to.deep.equal(new Int32Array([ -1,2,1,7,-1,2,6,2, 0,0 ]));
    expect(output.ptr).to.equal(8);
  });

  it('mappings decoder', function() {
    var buffer = toBuffer('uLAOA,SAASA,GAAcC,EAAMC,EAAIC,GACjC,OAAUF,GACV,IAAS,SAAT,MAA0B,IAAIG,GAAOF,EAAIC,EAAzC,KACS,cAAT,MAA+B');

    var reader = new VLQ.IntBufferReader(buffer, 0, buffer.length);

    var decoder = new VLQ.Decoder();
    var mappingsDecoder = new VLQ.MappingsDecoder(decoder).decode(reader);

    expect(decoder.mappings).to.deep.equal({
      lines: [ {
        mappings: [ { col: 183, src: 0, srcLine: 7,  srcCol: 0,  name: undefined },
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
          { col: 267, src: 0, srcLine: 10, srcCol: 31, name: undefined } ],
      } ],
    });
  });

  it('mappings decoder (another)', function() {
    var buffer = toBuffer(',YAAY;;AAArB,WAAS,YAAY,CAAC,IAAI,EAAE,MAAM,EAAE;AACjD,QAAI,KAAK,GAAG,CAAC,CAAC;AACd,QAAI,GAAG,GAAG,MAAM,CAAC,MAAM,GAAG,CAAC,CAAC;AAC5B,QAAI,MAAM,EAAE,CAAC,CAAC;;AAEd,WAAO,KAAK,GAAG,GAAG,EAAE;;;AAGlB,OAAC,GAAG,CAAC,GAAG,GAAG,KAAK,CAAA,GAAI,CAAC,CAAC;;;;AAItB,YAAM,GAAG,KAAK,GAAG,CAAC,GAAI,CAAC,GAAG,CAAC,AAAC,CAAC;;AAE7B,UAAI,IAAI,IAAI,MAAM,CAAC,MAAM,CAAC,EAAE;AAC1B,aAAK,GAAG,MAAM,GAAG,CAAC,CAAC;OACpB,MAAM;AACL,WAAG,GAAG,MAAM,CAAC;OACd;KACF;;AAED,WAAO,AAAC,IAAI,IAAI,MAAM,CAAC,KAAK,CAAC,GAAI,KAAK,GAAG,CAAC,GAAG,KAAK,CAAC;GACpD');

    var decoder = new VLQ.Decoder();
    var reader = new VLQ.IntBufferReader(buffer, 0, buffer.length);

    new VLQ.MappingsDecoder(decoder).decode(reader);

    var mappings = decoder.mappings;

    expect(mappings.lines.length, 'mappings.lines.length').to.equal(25);
    expect(mappings.lines[0].mappings.length).to.equal(1);
    expect(mappings.lines[0].mappings[0], 'YAAY').to.deep.equal({ srcLine: 0, srcCol: 12, src: 0, col: 12, name: undefined });

    expect(mappings.lines[1].mappings.length).to.equal(0);
    expect(mappings.lines[2].mappings.length).to.equal(8);

    expect(mappings.lines[2].mappings[0], 'AAArB').to.deep.equal({ srcLine: 0, srcCol: -9, src: 0, col:  0, name: undefined });
    expect(mappings.lines[2].mappings[1], 'WAAS').to.deep.equal({ srcLine: 0, srcCol:  0, src: 0, col: 11, name: undefined });
    expect(mappings.lines[2].mappings[2], 'YAAY').to.deep.equal({ srcLine: 0, srcCol: 12, src: 0, col: 23, name: undefined });
    expect(mappings.lines[2].mappings[3], 'CAAC').to.deep.equal({ srcLine: 0, srcCol: 13, src: 0, col: 24, name: undefined });
    expect(mappings.lines[2].mappings[4], 'IAAI').to.deep.equal({ srcLine: 0, srcCol: 17, src: 0, col: 28, name: undefined });
    expect(mappings.lines[2].mappings[5], 'EAAE').to.deep.equal({ srcLine: 0, srcCol: 19, src: 0, col: 30, name: undefined });
  });
});
