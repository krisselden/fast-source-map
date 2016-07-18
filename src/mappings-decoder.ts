import { decodeVLQ } from './vlq';
import IntBufferReader from './int-buffer-reader';

export interface Delegate {
  newline(): void;
  mapping1(column: number): void;
  mapping4(column: number, source: number, sourceLine: number, sourceColumn: number): void;
  mapping5(column: number, source: number, sourceLine: number, sourceColumn: number, name: number): void;
}

export default class MappingsDecoder {
  // absolutes
  line = 0;
  column = 0;
  source = 0;
  sourceLine = 0;
  sourceColumn = 0;
  name = 0;

  fieldCount = 0;

  delegate: Delegate;

  constructor(delegate: Delegate) {
    this.delegate = delegate;
  }

  decode(reader) {
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
  }

  emitNewline() {
    this.delegate.newline();
  }

  emitMapping() {
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
  }

  decodeField(reader) {
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

// ;;
// C;
// CEGI,
// AAAAK;
let warm = new Uint8Array([
  59,59,
  67,59,
  67,69,71,73,44,
  65,65,65,65,75,59
]);

let lines = 0;
let decoder = new MappingsDecoder({
    newline: function () {
      lines++;
    },
    mapping1: function (c) {
      if (c !== 1) throw new Error("smoke test failed");
    },
    mapping4: function (c, s, sl, sc) {
      if (c !== 1 || s !== 2 || sl !== 3 || sc !== 4) throw new Error("smoke test failed");
    },
    mapping5: function (c, s, sl, sc, n) {
      if (c !== 1 || s !== 2 || sl !== 3 || sc !== 4 || n !== 5) throw new Error("smoke test failed");
    }
});

let reader = new IntBufferReader(warm, 0, warm.length);
decoder.decode(reader);

if (lines !== 4) throw new Error("smoke test failed");