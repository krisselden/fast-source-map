import { Delegate } from './mappings-encoder';

export default class Encoder implements Delegate {
  buf;

  constructor(buf) {
    this.buf = buf;
  }

  separator() {
    this.buf.separator();
  }

  newline() {
    this.buf.newline();
  }

  write5(column, source, sourceLine, sourceColumn, name) {
    this.buf.write(column);
    this.buf.write(source);
    this.buf.write(sourceLine);
    this.buf.write(sourceColumn);
    this.buf.write(name);
  }

  write4(column, source, sourceLine, sourceColumn) {
    this.buf.write(column);
    this.buf.write(source);
    this.buf.write(sourceLine);
    this.buf.write(sourceColumn);
  }

  write1(column) {
    this.buf.write(column);
  }

  get length() {
    return this.buf.length;
  }
};
