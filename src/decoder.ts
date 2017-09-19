import { DecodedMappings, LineMappings } from './interfaces';
import { createMapping1, createMapping4, createMapping5 } from './mapping-factories';
import { Delegate } from './mappings-decoder';

export default class Decoder implements Delegate {
  public currentLine: LineMappings = [];

  public mappings: DecodedMappings = [this.currentLine];

  public newline() {
    this.currentLine = [];
    this.mappings.push(this.currentLine);
  }

  public mapping1(col: number) {
    this.currentLine.push(createMapping1(col));
  }

  public mapping4(col: number, src: number, srcLine: number, srcCol: number) {
    this.currentLine.push(createMapping4(col, src, srcLine, srcCol));
  }

  public mapping5(col: number, src: number, srcLine: number, srcCol: number, name: number) {
    this.currentLine.push(createMapping5(col, src, srcLine, srcCol, name));
  }
}
