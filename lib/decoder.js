export default function Decoder() {
  this.currentLine = {
    mappings: [],
  };

  this.mappings = {
    lines: [ this.currentLine ],
  };
}

Decoder.prototype = {
  newline() {
    this.currentLine = { mappings: [] };
    this.mappings.lines.push(this.currentLine);
  },

  mapping1(col) {
    this.currentLine.mappings.push({
      col,
      src: undefined,
      srcLine: undefined,
      srcCol: undefined,
      name: undefined,
    });
  },

  mapping4(col, src, srcLine, srcCol) {
    this.currentLine.mappings.push({
      col,
      src,
      srcLine,
      srcCol,
      name: undefined,
    });
  },

  mapping5(col, src, srcLine, srcCol, name) {
    this.currentLine.mappings.push({
      col,
      src,
      srcLine,
      srcCol,
      name,
    });
  },
};
