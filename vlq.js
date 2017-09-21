const fs = require('fs');

WebAssembly.compile(fs.readFileSync('vlq.wasm')).then(mod => {
  return WebAssembly.instantiate(mod, {
    env: {
      emitNewline() {
        console.log('emitNewline');
      },
      emitMapping1(col) {
        console.log('emitMapping1', col);
      },
      emitMapping4(col, src, srcLine, srcCol) {
        console.log('emitMapping4', col, src, srcLine, srcCol);
      },
      emitMapping5(col, src, srcLine, srcCol, name) {
        console.log('emitMapping5', col, src, srcLine, srcCol, name);
      },
    }
  });
}).then(instance => new Decoder(instance)).then((decoder) => {
  console.log('decodeVLQ', decoder.decodeVLQ('m766qH'));
  console.log('decodeVLQ', decoder.decodeVLQ('lth4ypC'));
  console.log('test decode mappings');
  decoder.decode("uLAOA,SAASA,GAAcC,EAAMC,EAAIC,GACjC,OAAUF;;GACV,IAAS,SAAT,MAA0B,IAAIG,GAAOF,EAAIC,EAAzC,KACS,cAAT,MAA+B");
});

class Decoder {
  constructor(mod) {
    const {
      decodeVLQ,
      decode,
      memory,
    } = mod.exports;
    this.mod = mod;
    this.bytes  = new Uint8Array(memory.buffer);
    this.heap32 = new Int32Array(memory.buffer);
    this._decode = decode;
    this._decodeVLQ = decodeVLQ;
  }

  decode(str) {
    this.writeReader(512, str);
    this._decode(512);
  }

  decodeVLQ(str) {
    this.writeReader(512, str);
    return this._decodeVLQ(512);
  }

  /**
   * write struct Reader
   * @param {number} ptr
   * @param {string} str
   */
  writeReader(ptr, str) {
    const stringPtr = ptr + 16;
    const heap32 = this.heap32;
    heap32[(ptr >> 2)] = 0;
    heap32[(ptr >> 2) + 1] = stringPtr;
    heap32[(ptr >> 2) + 2] = str.length;
    this.writeString(stringPtr, str);
  }

  /**
   * Write ascii string to memory
   * @param {Uint8Array} heap8
   * @param {number} ptr
   * @param {string} str
   */
  writeString(ptr, str) {
    let bytes = this.bytes;
    for (let i = 0; i < str.length; i++) {
      bytes[ptr + i] = str.charCodeAt(i);
    }
  }
}
