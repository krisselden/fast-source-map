import fs = require('fs');
import Decoder from './decoder';
import IntBufferReader from './int-buffer-reader';
import MappingsDecoder from './mappings-decoder';
import toBuffer from './utils/to-buffer';

export function decode(map) {
  const buffer = toBuffer(map.mappings);
  const reader = new IntBufferReader(buffer, 0, buffer.length);
  const decoder = new Decoder();
  const mappingsDecoder = new MappingsDecoder(decoder);

  mappingsDecoder.decode(reader);

  map.mappings = decoder.mappings;

  return map;
}

export function decodeFile(path) {
  return decode(JSON.parse(fs.readFileSync(path, { encoding: 'utf8' })));
}
