import { decodeVLQ } from './vlq';

export default function MappingsDecoder(delegate) {
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
