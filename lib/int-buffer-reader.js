export default function IntBufferReader(buf, ptr, len) {
  this.buf = buf;
  this.ptr = ptr|0;
  this.limit = (ptr + len)|0;
}

IntBufferReader.prototype = {
  peek: function peek() {
    return this.buf[this.ptr|0]|0;
  },

  read: function read() {
    var n = this.buf[this.ptr|0]|0;
    this.ptr = (this.ptr + 1)|0;
    return n;
  },

  next: function next() {
    this.ptr = (this.ptr + 1)|0;
  }
};
