(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  factory((global.VLQ = {}));
}(this, function (exports) { 'use strict';

  var uint6ToASCII = new Uint8Array(64);
  var asciiToUint6 = new Uint8Array(127);


  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (var i = 0; i < 64; i++) {
    var ascii = chars.charCodeAt(i);
    uint6ToASCII[i] = ascii;
    asciiToUint6[ascii] = i;
  }

  // 0 - 63 (6-bit 0 - 111111)
  // 32 100000 continuation bit
  // 31 011111 mask 5 bits
  // 1 is the sign bit
  function encodeVLQ(dest, v) {
    var num = v < 0 ? (-v << 1)|1 : v << 1;
    do {
      var digit = num & 31;
      num >>= 5;
      var cont = num > 0;
      if (cont) {
        digit |= 32;
      }
      dest.buf[dest.ptr++] = uint6ToASCII[digit];
    } while (cont);
  }

  function decodeVLQ(src) {
    var num = 0;
    var shift = 0;
    var digit = 0;
    var cont = 0;
    do {
      digit = asciiToUint6[src.buf[src.ptr++]];
      cont  = digit & 32;
      digit = digit & 31;
      num   = num + (digit << shift);
      shift += 5;
    } while (cont > 0);
    return num & 1 ? -(num >> 1) : (num >> 1);
  }

  function IntBufferReader(buf, ptr, len) {
    this.buf = buf;
    this.ptr = ptr|0;
    this.limit = (ptr + len)|0;
  }

  IntBufferReader.prototype = {
    peek: function peek() {
      return this.buf[this.ptr|0]|0;
    },

    read: function read() {
      var n = this.buf[this.ptr|0]|0;
      this.ptr = (this.ptr + 1)|0;
      return n;
    },

    next: function next() {
      this.ptr = (this.ptr + 1)|0;
    }
  };

  function IntBufferWriter(buf, ptr) {
    this.buf     = buf;
    this.ptr     = ptr|0;
    this.written = 0;
  }

  IntBufferWriter.prototype = {
    write: function write(n) {
      this.writeAt(this.ptr|0, n|0);
      this.ptr = (this.ptr + 1)|0;
      this.written = (this.written + 1)|0;
    }
  };

  function MappingsDecoder(delegate) {
    this.delegate = delegate;

    // absolutes
    this.line = 0;
    this.column = 0;
    this.source = 0;
    this.sourceLine = 0;
    this.sourceColumn = 0;
    this.name = 0;

    this.fieldCount = 0;
  }

  MappingsDecoder.prototype = {
    decode: function decode(reader) {
      while (reader.ptr < reader.limit) {
        switch (reader.buf[reader.ptr]) {
          case 59: // semicolon
            if (this.fieldCount > 0) {
              this.emitMapping();
            }
            this.emitNewline();
            this.column = 0;
            this.fieldCount = 0;
            reader.ptr++;
            break;
          case 44: // comma
            this.emitMapping();
            this.fieldCount = 0;
            reader.ptr++;
            break;
          default:
            this.decodeField(reader);
            break;
        }
      }
      if (this.fieldCount > 0) {
        this.emitMapping();
      }
    },

    emitNewline: function () {
      this.delegate.newline();
    },

    emitMapping: function () {
      switch (this.fieldCount) {
        case 1:
          this.delegate.mapping1(this.column);
          break;
        case 4:
          this.delegate.mapping4(this.column, this.source, this.sourceLine, this.sourceColumn);
          break;
        case 5:
          this.delegate.mapping5(this.column, this.source, this.sourceLine, this.sourceColumn, this.name);
          break;
      }
    },

    decodeField: function decodeField(reader) {
      var value = decodeVLQ(reader)|0;
      switch (this.fieldCount) {
        case 0:
          this.column += value;
          this.fieldCount = 1;
          break;
        case 1:
          this.source += value;
          this.fieldCount = 2;
          break;
        case 2:
          this.sourceLine += value;
          this.fieldCount = 3;
          break;
        case 3:
          this.sourceColumn += value;
          this.fieldCount = 4;
          break;
        case 4:
          this.name += value;
          this.fieldCount = 5;
          break;
      }
    }
  };

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

  exports.encodeVLQ = encodeVLQ;
  exports.decodeVLQ = decodeVLQ;
  exports.IntBufferReader = IntBufferReader;
  exports.IntBufferWriter = IntBufferWriter;
  exports.MappingsDecoder = MappingsDecoder;
  exports.Decoder = Decoder;

}));