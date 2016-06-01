import IntBufferReader from '../../lib/int-buffer-reader';
import IntBufferWriter from '../../lib/int-buffer-writer';
import { encodeVLQ, decodeVLQ } from '../../lib/vlq';
import Decoder from '../../lib/decoder';
import MappingsDecoder from '../../lib/mappings-decoder';
import Encoder from '../../lib/encoder';
import MappingsEncoder from '../../lib/mappings-encoder';
import toBuffer from '../../lib/utils/to-buffer';
import toString from '../../lib/utils/to-string';

const expect = require('chai').expect;

describe('test encode', function() {
  it('encodeVLQ', function() {
    let pos = 0;
    let buffer = [ 123, 456, 789, 987, 654, 321 ];
    let input = new IntBufferReader(buffer, 0, buffer.length);
    let output = new IntBufferWriter([], 0);

    [ 123, 456, 789, 987, 654, 321 ].forEach(function (n) {
      encodeVLQ(output, n);
    });

    expect(toString(output.buf, 0, output.ptr)).to.equal('2HwcqxB29B8oBiU');

    output = new IntBufferWriter(new Int32Array(10), 0);

    [ -1, 2, 1, 7, -1, 2, 6, 2 ].forEach(function (n) {
      encodeVLQ(output, n);
    });
    expect(toString(output.buf, 0, output.ptr)).to.equal('DECODEME');
  });

  it('decodeVLQ', function() {
    let output = {
      buf: new Int32Array(10),
      ptr: 0,
    };
    let input = {
      buf: toBuffer('DECODEME'),
      ptr: 0,
    };
    while (input.ptr < input.buf.length) {
      output.buf[output.ptr++] = decodeVLQ(input);
    }
    expect(output.buf).to.deep.equal(new Int32Array([ -1, 2, 1, 7, -1, 2, 6, 2, 0, 0 ]));
    expect(output.ptr).to.equal(8);
  });

  it('mappings decoder', function() {
    let buffer = toBuffer('uLAOA,SAASA,GAAcC,EAAMC,EAAIC,GACjC,OAAUF,GACV,IAAS,SAAT,MAA0B,IAAIG,GAAOF,EAAIC,EAAzC,KACS,cAAT,MAA+B');

    let reader = new IntBufferReader(buffer, 0, buffer.length);

    let decoder = new Decoder();
    let mappingsDecoder = new MappingsDecoder(decoder).decode(reader);

    expect(decoder.mappings).to.deep.equal({
      lines: [ {
        mappings: [
          { fieldCount: 4, col: 183, src: 0, srcLine: 7,  srcCol: 0,  name: undefined },
          { fieldCount: 5, col: 192, src: 0, srcLine: 7,  srcCol: 9,  name: 0 },
          { fieldCount: 5, col: 195, src: 0, srcLine: 7,  srcCol: 23, name: 1 },
          { fieldCount: 5, col: 197, src: 0, srcLine: 7,  srcCol: 29, name: 2 },
          { fieldCount: 5, col: 199, src: 0, srcLine: 7,  srcCol: 33, name: 3 },
          { fieldCount: 4, col: 202, src: 0, srcLine: 8,  srcCol: 0,  name: undefined },
          { fieldCount: 5, col: 209, src: 0, srcLine: 8,  srcCol: 10, name: 1 },
          { fieldCount: 4, col: 212, src: 0, srcLine: 9,  srcCol: 0,  name: undefined },
          { fieldCount: 4, col: 216, src: 0, srcLine: 9,  srcCol: 9,  name: undefined },
          { fieldCount: 4, col: 225, src: 0, srcLine: 9,  srcCol: 0,  name: undefined },
          { fieldCount: 4, col: 231, src: 0, srcLine: 9,  srcCol: 26, name: undefined },
          { fieldCount: 5, col: 235, src: 0, srcLine: 9,  srcCol: 30, name: 4 },
          { fieldCount: 5, col: 238, src: 0, srcLine: 9,  srcCol: 37, name: 2 },
          { fieldCount: 5, col: 240, src: 0, srcLine: 9,  srcCol: 41, name: 3 },
          { fieldCount: 4, col: 242, src: 0, srcLine: 9,  srcCol: 0,  name: undefined },
          { fieldCount: 4, col: 247, src: 0, srcLine: 10, srcCol: 9,  name: undefined },
          { fieldCount: 4, col: 261, src: 0, srcLine: 10, srcCol: 0,  name: undefined },
          { fieldCount: 4, col: 267, src: 0, srcLine: 10, srcCol: 31, name: undefined },
        ],
      } ],
    });
  });

  it('mappings decoder (another)', function() {
    let buffer = toBuffer(',YAAY;;AAArB,WAAS,YAAY,CAAC,IAAI,EAAE,MAAM,EAAE;AACjD,QAAI,KAAK,GAAG,CAAC,CAAC;AACd,QAAI,GAAG,GAAG,MAAM,CAAC,MAAM,GAAG,CAAC,CAAC;AAC5B,QAAI,MAAM,EAAE,CAAC,CAAC;;AAEd,WAAO,KAAK,GAAG,GAAG,EAAE;;;AAGlB,OAAC,GAAG,CAAC,GAAG,GAAG,KAAK,CAAA,GAAI,CAAC,CAAC;;;;AAItB,YAAM,GAAG,KAAK,GAAG,CAAC,GAAI,CAAC,GAAG,CAAC,AAAC,CAAC;;AAE7B,UAAI,IAAI,IAAI,MAAM,CAAC,MAAM,CAAC,EAAE;AAC1B,aAAK,GAAG,MAAM,GAAG,CAAC,CAAC;OACpB,MAAM;AACL,WAAG,GAAG,MAAM,CAAC;OACd;KACF;;AAED,WAAO,AAAC,IAAI,IAAI,MAAM,CAAC,KAAK,CAAC,GAAI,KAAK,GAAG,CAAC,GAAG,KAAK,CAAC;GACpD');

    let decoder = new Decoder();
    let reader = new IntBufferReader(buffer, 0, buffer.length);

    new MappingsDecoder(decoder).decode(reader);

    let mappings = decoder.mappings;

    expect(mappings.lines.length, 'mappings.lines.length').to.equal(25);
    expect(mappings.lines[0].mappings.length).to.equal(1);
    expect(mappings.lines[0].mappings[0], 'YAAY').to.deep.equal({ fieldCount: 4, srcLine: 0, srcCol: 12, src: 0, col: 12, name: undefined });

    expect(mappings.lines[1].mappings.length).to.equal(0);
    expect(mappings.lines[2].mappings.length).to.equal(8);

    expect(mappings.lines[2].mappings[0], 'AAArB').to.deep.equal({ fieldCount: 4, srcLine: 0, srcCol: -9, src: 0, col:  0, name: undefined });
    expect(mappings.lines[2].mappings[1], 'WAAS').to.deep.equal({ fieldCount: 4, srcLine: 0, srcCol:  0, src: 0, col: 11, name: undefined });
    expect(mappings.lines[2].mappings[2], 'YAAY').to.deep.equal({ fieldCount: 4, srcLine: 0, srcCol: 12, src: 0, col: 23, name: undefined });
    expect(mappings.lines[2].mappings[3], 'CAAC').to.deep.equal({ fieldCount: 4, srcLine: 0, srcCol: 13, src: 0, col: 24, name: undefined });
    expect(mappings.lines[2].mappings[4], 'IAAI').to.deep.equal({ fieldCount: 4, srcLine: 0, srcCol: 17, src: 0, col: 28, name: undefined });
    expect(mappings.lines[2].mappings[5], 'EAAE').to.deep.equal({ fieldCount: 4, srcLine: 0, srcCol: 19, src: 0, col: 30, name: undefined });
  });

  it('encoder', function() {
    // (lines + segemnts * 6) = byte_count
    let decoded = {
      mappings: {
        lines: [ {
          mappings: [
            { fieldCount: 4,col: 183, src: 0, srcLine: 7,  srcCol: 0,  name: undefined },
            { fieldCount: 5,col: 192, src: 0, srcLine: 7,  srcCol: 9,  name: 0 },
            { fieldCount: 5,col: 195, src: 0, srcLine: 7,  srcCol: 23, name: 1 },
            { fieldCount: 5,col: 197, src: 0, srcLine: 7,  srcCol: 29, name: 2 },
            { fieldCount: 5,col: 199, src: 0, srcLine: 7,  srcCol: 33, name: 3 },
            { fieldCount: 4,col: 202, src: 0, srcLine: 8,  srcCol: 0,  name: undefined },
            { fieldCount: 5,col: 209, src: 0, srcLine: 8,  srcCol: 10, name: 1 },
            { fieldCount: 4,col: 212, src: 0, srcLine: 9,  srcCol: 0,  name: undefined },
            { fieldCount: 4,col: 216, src: 0, srcLine: 9,  srcCol: 9,  name: undefined },
            { fieldCount: 4,col: 225, src: 0, srcLine: 9,  srcCol: 0,  name: undefined },
            { fieldCount: 4,col: 231, src: 0, srcLine: 9,  srcCol: 26, name: undefined },
            { fieldCount: 5,col: 235, src: 0, srcLine: 9,  srcCol: 30, name: 4 },
            { fieldCount: 5,col: 238, src: 0, srcLine: 9,  srcCol: 37, name: 2 },
            { fieldCount: 5,col: 240, src: 0, srcLine: 9,  srcCol: 41, name: 3 },
            { fieldCount: 4,col: 242, src: 0, srcLine: 9,  srcCol: 0,  name: undefined },
            { fieldCount: 4,col: 247, src: 0, srcLine: 10, srcCol: 9,  name: undefined },
            { fieldCount: 4,col: 261, src: 0, srcLine: 10, srcCol: 0,  name: undefined },
            { fieldCount: 4,col: 267, src: 0, srcLine: 10, srcCol: 31, name: undefined } ],
        } ],
      },
    };

    // TODO: pretty sure we can do a Uint8Array here
    // let buffer = new Uint32Array(estimatedSize);
    let buffer = [];
    let writer = new IntBufferWriter(buffer, 0);
    let encoder = new Encoder(writer);
    let mapper = new MappingsEncoder(encoder);

    let length = mapper.encode(decoded);

    expect(length, 'mapper.encode(decoded)').to.deep.equal(102); // TODO: this number is likely not right...
    expect(toString(buffer, 0, length))
      .to.deep.equal('uLAOA,SAASA,GAAcC,EAAMC,EAAIC,GACjC,OAAUF,GACV,IAAS,SAAT,MAA0B,IAAIG,GAAOF,EAAIC,EAAzC,KACS,cAAT,MAA+B');
  });
});
