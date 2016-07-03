export interface Mapping {
  fieldCount: number;
  col: number;
  src: number;
  srcLine: number;
  srcCol: number;
  name: number;
}

export interface LineMappings {
  mappings: Array<Mapping>;
}

export interface FileMappings {
  lines: Array<LineMappings>;
}

export default class Decoder {
  currentLine: Array<Mapping> = [];

  mappings: FileMappings = {
    lines: [{
      mappings: this.currentLine,
    }],
  };

  newline() {
    this.currentLine = [];
    this.mappings.lines.push({ mappings: this.currentLine });
  }

  mapping1(col) {
    this.currentLine.push({
      fieldCount: 1,
      col,
      src: undefined,
      srcLine: undefined,
      srcCol: undefined,
      name: undefined,
    });
  }

  mapping4(col, src, srcLine, srcCol) {
    this.currentLine.push({
      fieldCount: 4,
      col,
      src,
      srcLine,
      srcCol,
      name: undefined,
    });
  }

  mapping5(col, src, srcLine, srcCol, name) {
    this.currentLine.push({
      fieldCount: 5,
      col,
      src,
      srcLine,
      srcCol,
      name,
    });
  }
};
