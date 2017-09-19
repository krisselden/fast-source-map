export default function toBuffer(str: string) {
  const buffer = new Uint8Array(str.length);
  for (let i = 0; i < buffer.length; i++) {
    // this is for base64 so we know these are all < 123
    buffer[i] = str.charCodeAt(i) | 0;
  }
  return buffer;
}
