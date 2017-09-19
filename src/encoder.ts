import IntBufferWriter from './int-buffer-writer';
import { Delegate } from './mappings-encoder';

export default class Encoder implements Delegate {
  private buf: IntBufferWriter;

  constructor(buf: IntBufferWriter) {
    this.buf = buf;
  }

  public separator() {
    this.buf.separator();
  }

  public newline() {
    this.buf.newline();
  }

  public write5(column, source, sourceLine, sourceColumn, name) {
    this.buf.write(column);
    this.buf.write(source);
    this.buf.write(sourceLine);
    this.buf.write(sourceColumn);
    this.buf.write(name);
  }

  public write4(column, source, sourceLine, sourceColumn) {
    this.buf.write(column);
    this.buf.write(source);
    this.buf.write(sourceLine);
    this.buf.write(sourceColumn);
  }

  public write1(column) {
    this.buf.write(column);
  }

  get length() {
    return this.buf.length;
  }
}
