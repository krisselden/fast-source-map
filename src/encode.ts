import Encoder from './encoder';
import IntBufferWriter from './int-buffer-writer';
import MappingsEncoder from './mappings-encoder';
import toString from './utils/to-string';

import fs = require('fs');

export function encode(map) {
  const buffer = [];
  const writer = new IntBufferWriter(buffer, 0);
  const encoder = new Encoder(writer);
  const mappingsEncoder = new MappingsEncoder(encoder);

  mappingsEncoder.encode(map);

  map.mappings = toString(buffer, 0, buffer.length);

  return map;
}

/**
 * Takes a source map file with a decoded `mappings` section and reencodes
 * `mappings`.
 */
export function encodeFile(path) {
  const map = JSON.parse(fs.readFileSync(path, { encoding: 'utf8' }));
  return encode(map);
}
