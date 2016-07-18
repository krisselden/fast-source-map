import { decodeVLQ } from "./vlq";
import Reader from "./reader";

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

  decode(reader: Reader) {
    while (reader.hasNext()) {
      switch (reader.peek()) {
        case 59: // semicolon
          if (this.fieldCount > 0) {
            this.emitMapping();
          }
          this.emitNewline();
          this.column = 0;
          this.fieldCount = 0;
          reader.next();
          break;
        case 44: // comma
          this.emitMapping();
          this.fieldCount = 0;
          reader.next();
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
    let value = decodeVLQ(reader) | 0;
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
