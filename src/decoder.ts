import { Delegate } from "./mappings-decoder";
import { FullDecodedMapping, DecodedMappings } from "./interfaces";

export default class Decoder implements Delegate {
  currentLine: Array<FullDecodedMapping> = [];

  mappings: DecodedMappings = [this.currentLine];

  newline() {
    this.currentLine = [];
    this.mappings.push(this.currentLine);
  }

  mapping1(col) {
    this.currentLine.push({
      fieldCount: 1,
      col,
      src: 0,
      srcLine: 0,
      srcCol: 0,
      name: 0,
    });
  }

  mapping4(col, src, srcLine, srcCol) {
    this.currentLine.push({
      fieldCount: 4,
      col,
      src,
      srcLine,
      srcCol,
      name: 0,
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
