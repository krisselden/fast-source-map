export interface DecodedMapping {
  fieldCount: number;
  col: number;
  src: number;
  srcLine: number;
  srcCol: number;
  name: number;
}

export type LineMappings = DecodedMapping[];

export type DecodedMappings = LineMappings[];

export interface DecodedSourceMap {
  version: string;
  sources: string[];
  sourcesContent: string[];
  names: string[];
  mappings: DecodedMappings;
  file: string;
}
