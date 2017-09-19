export default function toString(buffer: number[] | Uint8Array, offset: number, len: number) {
  let str = '';
  for (let i = offset; i < len; i++) {
    str += String.fromCharCode(buffer[i]);
  }
  return str;
}
