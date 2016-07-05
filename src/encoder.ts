import { Delegate } from './mappings-encoder';

export default class Encoder implements Delegate {
  writer;

  constructor(writer) {
    this.writer = writer;
  }

  separator() {
    this.writer.separator();
  }

  newline() {
    this.writer.newline();
  }

  write5(column, source, sourceLine, sourceColumn, name) {
    this.writer.write(column);
    this.writer.write(source);
    this.writer.write(sourceLine);
    this.writer.write(sourceColumn);
    this.writer.write(name);
  }

  write4(column, source, sourceLine, sourceColumn) {
    this.writer.write(column);
    this.writer.write(source);
    this.writer.write(sourceLine);
    this.writer.write(sourceColumn);
  }

  write1(column) {
    this.writer.write(column);
  }

  get length() {
    return this.writer.length;
  }
};
