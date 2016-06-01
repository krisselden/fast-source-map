import { encodeVLQ } from './vlq';

export default function IntBufferWriter(buf, ptr) {
  this.buf = buf;
  this.ptr = ptr|0;
}

IntBufferWriter.prototype = {
  write(n) {
    encodeVLQ(this, n);
  },
};
