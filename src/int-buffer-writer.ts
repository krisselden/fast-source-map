import { encodeVLQ } from './vlq';

export default class IntBufferWriter {
  public buf: Uint8Array | number[];
  public ptr: number;

  constructor(buf: Uint8Array | number[], ptr: number) {
    this.buf = buf;
    this.ptr = ptr | 0;
  }

  public write(n) {
    encodeVLQ(this, n);
  }

  public separator() {
    this.buf[this.ptr++] = 44; /* , */
  }

  public newline() {
    this.buf[this.ptr++] = 59; /* ; */
  }

  get length() {
    return this.buf.length;
  }
}
