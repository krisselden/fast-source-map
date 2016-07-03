export default function MappingsEncoder(delegate) {
  this.delegate     = delegate;
  this.column       = 0;
  this.source       = 0;
  this.sourceLine   = 0;
  this.sourceColumn = 0;
  this.name         = 0;
}

function missingFieldCount() {
  throw new TypeError('mappings to encode require fieldCount');
}

MappingsEncoder.prototype = {
  encode({ mappings }) {
    for (let i = 0; i < mappings.lines.length;i++) {
      let line = mappings.lines[i];

      for (let j = 0; j < line.mappings.length; j++) {
        let mapping = line.mappings[j];

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
  },

  separator() {
    this.delegate.separator();
  },

  newline() {
    this.delegate.newline();
  },

  write5(mapping) {
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
  },

  write4(mapping) {
    this.delegate.write4(
      mapping.col     - this.column,
      mapping.src     - this.source,
      mapping.srcLine - this.sourceLine,
      mapping.srcCol  - this.sourceColumn);

    this.column       = mapping.col;
    this.source       = mapping.src;
    this.sourceLine   = mapping.srcLine;
    this.sourceColumn = mapping.srcCol;
  },

  write1(mapping) {
    this.delegate.write1(mapping.col - this.column);

    this.column = mapping.col;
  },
};
