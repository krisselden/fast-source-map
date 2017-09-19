import Encoder from './encoder';
import IntBufferWriter from './int-buffer-writer';
import MappingsEncoder from './mappings-encoder';
import readFile from './utils/read-file';
import toString from './utils/to-string';

export function encode(map: any) {
  const buffer: number[] = [];
  const writer = new IntBufferWriter(buffer, 0);
  const encoder = new Encoder(writer);
  const mappingsEncoder = new MappingsEncoder(encoder);

  mappingsEncoder.encode(map.mappings);

  map.mappings = toString(buffer, 0, buffer.length);

  return map;
}

/**
 * Takes a source map file with a decoded `mappings` section and reencodes
 * `mappings`.
 */
export function encodeFile(path: string) {
  const map = JSON.parse(readFile(path));
  return encode(map);
}
