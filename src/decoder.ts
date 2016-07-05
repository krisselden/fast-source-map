import { Delegate } from './mappings-decoder';
import { Mapping, FileMappings } from './interfaces';

export default class Decoder implements Delegate {
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
