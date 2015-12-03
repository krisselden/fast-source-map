export default function IntBufferWriter(buf, ptr) {
  this.buf     = buf;
  this.ptr     = ptr|0;
  this.written = 0;
}

IntBufferWriter.prototype = {
  write: function write(n) {
    this.writeAt(this.ptr|0, n|0);
    this.ptr = (this.ptr + 1)|0;
    this.written = (this.written + 1)|0;
  }
};
