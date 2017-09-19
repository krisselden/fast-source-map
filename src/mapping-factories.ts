import { DecodedMapping } from './interfaces';

export function createMapping1(col: number): DecodedMapping {
  return {
    col,
    fieldCount: 1,
    name: 0,
    src: 0,
    srcCol: 0,
    srcLine: 0,
  };
}

export function createMapping4(col: number, src: number, srcLine: number, srcCol: number): DecodedMapping {
  return {
    col,
    fieldCount: 4,
    name: 0,
    src,
    srcCol,
    srcLine,
  };
}

export function createMapping5(col: number,
                               src: number,
                               srcLine: number,
                               srcCol: number,
                               name: number): DecodedMapping {
  return {
    col,
    fieldCount: 5,
    name,
    src,
    srcCol,
    srcLine,
  };
}
