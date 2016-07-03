import IntBufferWriter from './int-buffer-writer';
import Encoder from './encoder';
import toString from './utils/to-string';
import MappingsEncoder from './mappings-encoder';

const fs = require('fs');

export function encode(map) {
  let buffer = [];
  let writer = new IntBufferWriter(buffer, 0);
  let encoder = new Encoder(writer);
  var mappingsEncoder = new MappingsEncoder(encoder);

  mappingsEncoder.encode(map);

  map.mappings = toString(buffer, 0, buffer.length);

  return map;
}

/**
  Takes a source map file with a decoded `mappings` section and reencodes
  `mappings`.
*/
export function encodeFile(path) {
  var map = JSON.parse(fs.readFileSync(path, { encoding: 'utf8' }));
  return encode(map);
}

