const fs = require('fs');
const path = require('path');

module.exports.createDecoder = function createDecoder(delegate) {
  return WebAssembly.compile(fs.readFileSync(path.join(__dirname, 'vlq.wasm')))
    .then((mod) => {
      return WebAssembly.instantiate(mod, {
        env: {
          emitNewline() {
            delegate.emitNewline();
          },
          emitMapping1(col) {
            delegate.emitMapping1(col);
          },
          emitMapping4(col, src, srcLine, srcCol) {
            delegate.emitMapping4(col, src, srcLine, srcCol);
          },
          emitMapping5(col, src, srcLine, srcCol, name) {
            delegate.emitMapping4(col, src, srcLine, srcCol, name);
          },
        }
      });
    })
    .then((instance) => new Decoder(instance));
}

class Decoder {
  constructor(mod) {
    const {
      decodeVLQ,
      decode,
      memory,
    } = mod.exports;
    this._mod = mod;
    this._memory = memory;
    this._decode = decode;
    this._decodeVLQ = decodeVLQ;
  }

  decode(str) {
    this._writeReader(512, str);
    this._decode(512);
  }

  decodeVLQ(str) {
    this._writeReader(512, str);
    return this._decodeVLQ(512);
  }

  _ensureMem(str) {
    const needed = str.length - this._memory.buffer.byteLength + 1024;
    if (needed > 0) {
      const pages = Math.ceil(needed / 65536);
      this._memory.grow(pages);
    }
  }

  /**
   * write struct Reader
   * @param {number} ptr
   * @param {string} str
   */
  _writeReader(ptr, str) {
    this._ensureMem(str);

    const stringPtr = ptr + 16;
    const heap32 = new Int32Array(this._memory.buffer);
    heap32[(ptr >> 2)] = 0;
    heap32[(ptr >> 2) + 1] = stringPtr;
    heap32[(ptr >> 2) + 2] = str.length;
    this._writeString(stringPtr, str);
  }

  /**
   * Write ascii string to memory
   * @param {Uint8Array} heap8
   * @param {number} ptr
   * @param {string} str
   */
  _writeString(ptr, str) {
    const bytes = new Uint8Array(this._memory.buffer);
    for (let i = 0; i < str.length; i++) {
      bytes[ptr + i] = str.charCodeAt(i);
    }
  }
}
