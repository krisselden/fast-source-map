import { FullDecodedMapping } from "./interfaces";

export function createMapping1(col): FullDecodedMapping {
  return {
    fieldCount: 1,
    col,
    src: 0,
    srcLine: 0,
    srcCol: 0,
    name: 0,
  };
}

export function createMapping4(col, src, srcLine, srcCol): FullDecodedMapping {
  return {
    fieldCount: 4,
    col,
    src,
    srcLine,
    srcCol,
    name: 0,
  };
}

export function createMapping5(col, src, srcLine, srcCol, name): FullDecodedMapping {
  return {
    fieldCount: 5,
    col,
    src,
    srcLine,
    srcCol,
    name,
  };
}
