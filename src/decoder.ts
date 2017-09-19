import { Delegate } from './mappings-decoder';

export interface Mapping {
  fieldCount: number;
  col: number;
  src: number;
  srcLine: number;
  srcCol: number;
  name: number;
}

export interface LineMappings {
  mappings: Mapping[];
}

export interface FileMappings {
  lines: LineMappings[];
}

export default class Decoder implements Delegate {
  public currentLine: Mapping[] = [];

  public mappings: FileMappings = {
    lines: [{
      mappings: this.currentLine,
    }],
  };

  public newline() {
    this.currentLine = [];
    this.mappings.lines.push({ mappings: this.currentLine });
  }

  public mapping1(col) {
    this.currentLine.push({
      col,
      fieldCount: 1,
      name: undefined,
      src: undefined,
      srcCol: undefined,
      srcLine: undefined,
    });
  }

  public mapping4(col, src, srcLine, srcCol) {
    this.currentLine.push({
      col,
      fieldCount: 4,
      name: undefined,
      src,
      srcCol,
      srcLine,
    });
  }

  public mapping5(col, src, srcLine, srcCol, name) {
    this.currentLine.push({
      col,
      fieldCount: 5,
      name,
      src,
      srcCol,
      srcLine,
    });
  }
}
