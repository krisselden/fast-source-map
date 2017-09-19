export interface Delegate {
  length: number;

  newline(): void;
  separator(): void;
  write1(column: number): void;
  write4(column: number, source: number, sourceLine: number, sourceColumn: number): void;
  write5(column: number, source: number, sourceLine: number, sourceColumn: number, name: number): void;
}

export default class MappingsEncoder {
  private column = 0;
  private source = 0;
  private sourceLine = 0;
  private sourceColumn = 0;
  private name = 0;

  private delegate: Delegate;

  constructor(delegate: Delegate) {
    this.delegate = delegate;
  }

  public encode({ mappings }) {
    for (let i = 0; i < mappings.lines.length; i++) {
      const line = mappings.lines[i];

      for (let j = 0; j < line.mappings.length; j++) {
        const mapping = line.mappings[j];

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

        if (j < line.mappings.length - 1) {
          // no trailing segment separator
          this.separator();
        }
      }

      if (i < mappings.lines.length - 1 ) {
        // skip trailing line separator
        this.newline();
      }

      this.column = 0;
    }

    return this.delegate.length;
  }

  private separator() {
    this.delegate.separator();
  }

  private newline() {
    this.delegate.newline();
  }

  private write5(mapping) {
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

  private write4(mapping) {
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

  private write1(mapping) {
    this.delegate.write1(mapping.col - this.column);

    this.column = mapping.col;
  }
}

function missingFieldCount() {
  throw new TypeError('mappings to encode require fieldCount');
}
