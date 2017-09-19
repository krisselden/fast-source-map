import { DecodedMappings } from './interfaces';

export interface Delegate {
  length: number;
  newline(): void;
  separator(): void;
  write1(column: number): void;
  write4(column: number, source: number, sourceLine: number, sourceColumn: number): void;
  write5(column: number, source: number, sourceLine: number, sourceColumn: number, name: number): void;
}

export default class MappingsEncoder {
  public column = 0;
  public source = 0;
  public sourceLine = 0;
  public sourceColumn = 0;
  public name = 0;

  public delegate: Delegate;

  constructor(delegate: Delegate) {
    this.delegate = delegate;
  }

  public encode(mappings: DecodedMappings) {
    for (let i = 0; i < mappings.length; i++) {
      const line = mappings[i];

      for (let j = 0; j < line.length; j++) {
        const mapping = line[j];

        switch (mapping.fieldCount) {
          case 1:
            this.write1(mapping);
            break;
          case 4:
            this.write4(mapping);
            break;
          case 5:
            this.write5(mapping);
            break;
          default:
            missingFieldCount();
        }

        if (j < line.length - 1) {
          // no trailing segment separator
          this.separator();
        }
      }

      if (i < mappings.length - 1 ) {
        // skip trailing line separator
        this.newline();
      }

      this.column = 0;
    }

    return this.delegate.length;
  }

  public separator() {
    this.delegate.separator();
  }

  public newline() {
    this.delegate.newline();
  }

  public write5(mapping: {
    col: number;
    src: number;
    srcLine: number;
    srcCol: number;
    name: number;
  }) {
    this.delegate.write5(
      mapping.col     - this.column,
      mapping.src     - this.source,
      mapping.srcLine - this.sourceLine,
      mapping.srcCol  - this.sourceColumn,
      mapping.name    - this.name);

    this.column       = mapping.col;
    this.source       = mapping.src;
    this.sourceLine   = mapping.srcLine;
    this.sourceColumn = mapping.srcCol;
    this.name         = mapping.name;
  }

  public write4(mapping: {
    col: number;
    src: number;
    srcLine: number;
    srcCol: number;
  }) {
    this.delegate.write4(
      mapping.col     - this.column,
      mapping.src     - this.source,
      mapping.srcLine - this.sourceLine,
      mapping.srcCol  - this.sourceColumn);

    this.column       = mapping.col;
    this.source       = mapping.src;
    this.sourceLine   = mapping.srcLine;
    this.sourceColumn = mapping.srcCol;
  }

  public write1(mapping: {
    col: number;
  }) {
    this.delegate.write1(mapping.col - this.column);

    this.column = mapping.col;
  }
}

function missingFieldCount() {
  throw new TypeError('mappings to encode require fieldCount');
}
