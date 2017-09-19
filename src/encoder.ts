import { Delegate } from './mappings-encoder';
import { encodeVLQ } from './vlq';
import Writer from './writer';

export default class Encoder implements Delegate {
  public writer: Writer;

  constructor(writer: Writer) {
    this.writer = writer;
  }

  public separator() {
    this.writer.write(44); /* , */
  }

  public newline() {
    this.writer.write(59); /* ; */
  }

  public write5(column: number, source: number, sourceLine: number, sourceColumn: number, name: number) {
    encodeVLQ(this.writer, column);
    encodeVLQ(this.writer, source);
    encodeVLQ(this.writer, sourceLine);
    encodeVLQ(this.writer, sourceColumn);
    encodeVLQ(this.writer, name);
  }

  public write4(column: number, source: number, sourceLine: number, sourceColumn: number) {
    encodeVLQ(this.writer, column);
    encodeVLQ(this.writer, source);
    encodeVLQ(this.writer, sourceLine);
    encodeVLQ(this.writer, sourceColumn);
  }

  public write1(column: number) {
    encodeVLQ(this.writer, column);
  }

  get length() {
    return this.writer.length;
  }
}
