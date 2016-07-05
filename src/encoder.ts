import { Delegate } from './mappings-encoder';
import { encodeVLQ } from './vlq';

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
    encodeVLQ(this.writer, column);
    encodeVLQ(this.writer, source);
    encodeVLQ(this.writer, sourceLine);
    encodeVLQ(this.writer, sourceColumn);
    encodeVLQ(this.writer, name);
  }

  write4(column, source, sourceLine, sourceColumn) {
    encodeVLQ(this.writer, column);
    encodeVLQ(this.writer, source);
    encodeVLQ(this.writer, sourceLine);
    encodeVLQ(this.writer, sourceColumn);
  }

  write1(column) {
    encodeVLQ(this.writer, column);
  }

  get length() {
    return this.writer.length;
  }
};
