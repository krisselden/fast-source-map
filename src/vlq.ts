import { uint6ToASCII, asciiToUint6 } from './base64';
import IntBufferReader from './int-buffer-reader';

// 0 - 63 (6-bit 0 - 111111)
// 32 100000 continuation bit
// 31 011111 mask 5 bits
// 1  000001 is the sign bit
export function encodeVLQ(writer: { buf: number[], ptr: number }, v: number) {
  var num = v < 0 ? (~v + 1) << 1 | 1 : v << 1;
  do {
    var digit = num & 31;
    num >>= 5;
    var cont = num > 0;
    if (cont) {
      digit |= 32;
    }
    writer.buf[writer.ptr++] = uint6ToASCII[digit];
  } while (cont);
}

export function decodeVLQ(reader: { read(): number }) {
  var num = 0;
  var shift = 0;
  var digit = 0;
  var cont = 0;
  do {
    digit = asciiToUint6[reader.read()];
    cont  = digit & 32; // 100000
    digit = digit & 31; // 011111
    num   = num + (digit << shift);
    shift += 5;
  } while (cont > 0);
  return (num & 1) === 1 ? ~(num >> 1) + 1 : (num >> 1);
}

let warm = new Uint8Array([ 65, 75, 85, 119, 43, 66, 120, 43, 66 ]);
let reader = new IntBufferReader(warm, 0, warm.length);
[0, 5, 10, 1000, -1000].forEach(function (v) {
  if (decodeVLQ(reader) !== v) {
    throw new Error("smoke test failed");
  }
});