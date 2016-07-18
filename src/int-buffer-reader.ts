import Reader from "./reader";

export default class IntBufferReader implements Reader {
  buf: number[];
  ptr: number;
  limit: number;

  constructor(buf, ptr, len) {
    this.buf = buf;
    this.ptr = ptr | 0;
    this.limit = (ptr + len) | 0;
  }

  peek() {
    return this.buf[this.ptr | 0] | 0;
  }

  read() {
    let n = this.buf[this.ptr | 0] | 0;
    this.ptr = (this.ptr + 1) | 0;
    return n;
  }

  next() {
    this.ptr = (this.ptr + 1) | 0;
  }

  hasNext(): boolean {
    return this.ptr < this.limit;
  }
}
