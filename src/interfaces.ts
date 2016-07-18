export interface DecodedMapping {
  fieldCount: number;
  col: number;
  src?: number;
  srcLine?: number;
  srcCol?: number;
  name?: number;
}

export interface FullDecodedMapping extends DecodedMapping{
  src: number;
  srcLine: number;
  srcCol: number;
  name: number;
}

export type LineMappings = Array<DecodedMapping>

export interface LineDescriptor {
  mappings: LineMappings;
}

export interface DecodedMappings {
  lines: Array<LineDescriptor>;
}

export interface DecodedSourceMap {
  version: string;
  sources: Array<string>;
  sourcesContent: Array<string>;
  names: Array<string>;
  mappings: DecodedMappings;
  file: string;
}
