import IntBufferReader from "./int-buffer-reader";
import Decoder from "./decoder";
import MappingsDecoder from "./mappings-decoder";
import toBuffer from "./utils/to-buffer";
import readFile from "./utils/read-file";

export function decode(map) {
  let buffer = toBuffer(map.mappings);
  let reader = new IntBufferReader(buffer, 0, buffer.length);
  let decoder = new Decoder();
  let mappingsDecoder = new MappingsDecoder(decoder);

  mappingsDecoder.decode(reader);

  map.mappings = decoder.mappings;

  return map;
}

export function decodeFile(path) {
  return decode(JSON.parse(readFile(path)));
}
