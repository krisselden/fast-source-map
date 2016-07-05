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

  get length() {
    return this.buf.length;
  }
}
