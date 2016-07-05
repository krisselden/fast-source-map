import { encodeVLQ } from './vlq';
import Writer from './writer';

export default class IntBufferWriter implements Writer {
  buf;
  ptr;

  constructor(buf, ptr) {
    this.buf = buf;
    this.ptr = ptr|0;
  }

  write(n) {
    this.buf[this.ptr++] = n;
  }

  writeVLQ(n) {
    encodeVLQ(this, n);
  }

  separator() {
    this.write(44); /* , */
  }

  newline() {
    this.write(59); /* ; */
  }

  get length() {
    return this.buf.length;
  }
}
