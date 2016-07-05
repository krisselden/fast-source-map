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
    this.writer.writeVLQ(column);
    this.writer.writeVLQ(source);
    this.writer.writeVLQ(sourceLine);
    this.writer.writeVLQ(sourceColumn);
    this.writer.writeVLQ(name);
  }

  write4(column, source, sourceLine, sourceColumn) {
    this.writer.writeVLQ(column);
    this.writer.writeVLQ(source);
    this.writer.writeVLQ(sourceLine);
    this.writer.writeVLQ(sourceColumn);
  }

  write1(column) {
    this.writer.writeVLQ(column);
  }

  get length() {
    return this.writer.length;
  }
};
