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
