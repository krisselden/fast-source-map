import IntBufferWriter from './int-buffer-writer';
import Encoder from './encoder';
import toString from './utils/to-string';

export function encode(map) {
  let buffer = [];
  let writer = new IntBufferWriter(buffer, 0);
  let encoder = new Encoder(writer);

  let length = encoder.encode(map);

  map.mappings = toString(buffer, 0, buffer.length);

  return map;
}

/**
  Takes a source map file with a decoded `mappings` section and reencodes
  `mappings`.
*/
export function encodeFile(path) {
  var map = JSON.parse(fs.readFileSync(path));
  return encode(map);
}

