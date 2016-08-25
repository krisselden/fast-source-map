import { Delegate } from "./mappings-decoder";
import { FullDecodedMapping, DecodedMappings } from "./interfaces";
import { createMapping1, createMapping4, createMapping5 } from "./mapping-factories";

export default class Decoder implements Delegate {
  currentLine: Array<FullDecodedMapping> = [];

  mappings: DecodedMappings = [this.currentLine];

  newline() {
    this.currentLine = [];
    this.mappings.push(this.currentLine);
  }

  mapping1(col) {
    this.currentLine.push(createMapping1(col));
  }

  mapping4(col, src, srcLine, srcCol) {
    this.currentLine.push(createMapping4(col, src, srcLine, srcCol));
  }

  mapping5(col, src, srcLine, srcCol, name) {
    this.currentLine.push(createMapping5(col, src, srcLine, srcCol, name));
  }
};
