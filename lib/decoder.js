

export default function Decoder() {
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
