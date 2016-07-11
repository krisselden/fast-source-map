import { encodeVLQ } from './vlq';

export default class IntBufferWriter {
  buf;
  ptr;

  constructor(buf, ptr) {
    this.buf = buf;
    this.ptr = ptr|0;
  }

  write(n) {
    encodeVLQ(this, n);
  }

  separator() {
    this.buf[this.ptr++] = 44; /* , */
  }

  newline() {
    this.buf[this.ptr++] = 59; /* ; */
  }

  get length() {
    return this.buf.length;
  }
}
