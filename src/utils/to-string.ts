export default function toString(buffer, offset, len) {
  let str = '';
  for (let i = offset; i < len; i++) {
    str += String.fromCharCode(buffer[i]);
  }
  return str;
}
