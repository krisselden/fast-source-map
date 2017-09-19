import {
  asciiToUint6,
  uint6ToASCII,
} from './base64';
import IntBufferReader from './int-buffer-reader';

// 0 - 63 (6-bit 0 - 111111)
// 32 100000 continuation bit
// 31 011111 mask 5 bits
// 1  000001 is the sign bit
export function encodeVLQ(writer: { buf: number[] | Uint8Array, ptr: number }, v: number) {
  let num = v < 0 ? (~v + 1) << 1 | 1 : v << 1;
  let cont: boolean;
  do {
    let digit = num & 31;
    num >>= 5;
    cont = num > 0;
    if (cont) {
      digit |= 32;
    }
    writer.buf[writer.ptr++] = uint6ToASCII[digit];
  } while (cont);
}

export function decodeVLQ(reader: { read(): number }) {
  let num = 0;
  let shift = 0;
  let digit = 0;
  let cont = 0;
  do {
    digit = asciiToUint6[reader.read()];
    cont  = digit & 32; // 100000
    digit = digit & 31; // 011111
    num   = num + (digit << shift);
    shift += 5;
  } while (cont > 0);
  return (num & 1) === 1 ? ~(num >> 1) + 1 : (num >> 1);
}

(() => {
  const warm = new Uint8Array([ 65, 75, 85, 119, 43, 66, 120, 43, 66 ]);
  const reader = new IntBufferReader(warm, 0, warm.length);
  [0, 5, 10, 1000, -1000].forEach((v) => {
    if (decodeVLQ(reader) !== v) {
      throw new Error('smoke test failed');
    }
  });
})();
