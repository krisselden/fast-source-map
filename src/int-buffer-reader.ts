import Reader from './reader';

export default class IntBufferReader implements Reader {
  public buf: number[] | Uint8Array;
  public ptr: number;
  public limit: number;

  constructor(buf: number[] | Uint8Array, ptr: number, len: number) {
    this.buf = buf;
    this.ptr = ptr | 0;
    this.limit = (ptr + len) | 0;
  }

  public peek() {
    return this.buf[this.ptr | 0] | 0;
  }

  public read() {
    const n = this.buf[this.ptr | 0] | 0;
    this.ptr = (this.ptr + 1) | 0;
    return n;
  }

  public next() {
    this.ptr = (this.ptr + 1) | 0;
  }

  public hasNext(): boolean {
    return this.ptr < this.limit;
  }
}
