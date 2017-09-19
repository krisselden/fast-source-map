import Writer from './writer';

export default class IntBufferWriter implements Writer {
  public buf: number[] | Uint8Array;
  public ptr: number;

  constructor(buf: number[] | Uint8Array, ptr: number) {
    this.buf = buf;
    this.ptr = ptr | 0;
  }

  public write(n: number) {
    this.buf[this.ptr++] = n | 0;
  }

  public get length() {
    return this.buf.length;
  }
}
