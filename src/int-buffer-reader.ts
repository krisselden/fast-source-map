export default class IntBufferReader {
  buf;
  ptr;
  limit;

  constructor(buf, ptr, len) {
    this.buf = buf;
    this.ptr = ptr|0;
    this.limit = (ptr + len)|0;
  }

  peek() {
    return this.buf[this.ptr|0]|0;
  }

  read() {
    var n = this.buf[this.ptr|0]|0;
    this.ptr = (this.ptr + 1)|0;
    return n;
  }

  next() {
    this.ptr = (this.ptr + 1)|0;
  }
}
