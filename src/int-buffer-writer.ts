import Writer from "./writer";

export default class IntBufferWriter implements Writer {
  buf: number[];
  ptr: number;

  constructor(buf, ptr) {
    this.buf = buf;
    this.ptr = ptr | 0;
  }

  write(n: number) {
    this.buf[this.ptr++] = n | 0;
  }

  get length() {
    return this.buf.length;
  }
}
