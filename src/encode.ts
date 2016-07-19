import IntBufferWriter from "./int-buffer-writer";
import Encoder from "./encoder";
import toString from "./utils/to-string";
import MappingsEncoder from "./mappings-encoder";
import readFile from "./utils/read-file";

export function encode(map) {
  let buffer = [];
  let writer = new IntBufferWriter(buffer, 0);
  let encoder = new Encoder(writer);
  let mappingsEncoder = new MappingsEncoder(encoder);

  mappingsEncoder.encode(map.mappings);

  map.mappings = toString(buffer, 0, buffer.length);

  return map;
}

/**
  Takes a source map file with a decoded `mappings` section and reencodes
  `mappings`.
*/
export function encodeFile(path) {
  let map = JSON.parse(readFile(path));
  return encode(map);
}
