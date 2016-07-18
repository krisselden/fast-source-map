import { uint6ToASCII, asciiToUint6 } from './base64';
import Writer from './writer';
import Reader from './reader';

// 0 - 63 (6-bit 0 - 111111)
// 32 100000 continuation bit
// 31 011111 mask 5 bits
// 1 is the sign bit
export function encodeVLQ(writer: Writer, v) {
  var num = v < 0 ? (-v << 1)|1 : v << 1;
  do {
    var digit = num & 31;
    num >>= 5;
    var cont = num > 0;
    if (cont) {
      digit |= 32;
    }
    writer.write(uint6ToASCII[digit]);
  } while (cont);
}

export function decodeVLQ(reader: Reader) {
  var num = 0;
  var shift = 0;
  var digit = 0;
  var cont = 0;
  do {
    digit = asciiToUint6[reader.read()];
    cont  = digit & 32;
    digit = digit & 31;
    num   = num + (digit << shift);
    shift += 5;
  } while (cont > 0);
  return num & 1 ? -(num >> 1) : (num >> 1);
}
