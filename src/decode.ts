import Decoder from './decoder';
import IntBufferReader from './int-buffer-reader';
import { DecodedSourceMap } from './interfaces';
import MappingsDecoder from './mappings-decoder';
import readFile from './utils/read-file';
import toBuffer from './utils/to-buffer';

export function decode(map: any): DecodedSourceMap {
  const buffer = toBuffer(map.mappings);
  const reader = new IntBufferReader(buffer, 0, buffer.length);
  const decoder = new Decoder();
  const mappingsDecoder = new MappingsDecoder(decoder);

  mappingsDecoder.decode(reader);

  map.mappings = decoder.mappings;

  return map;
}

export function decodeFile(path: string) {
  return decode(JSON.parse(readFile(path)));
}
