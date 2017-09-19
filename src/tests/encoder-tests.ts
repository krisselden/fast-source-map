import { expect } from 'chai';
import { MappingsEncoder, MappingsEncoderDelegate } from '../index';

class Encoder implements MappingsEncoderDelegate {
  public writes: Array<string | number> = [];

  public write1(n: number): void {
    this.writes.push(n);
  }

  public write4(a: number, b: number, c: number, d: number): void {
    this.writes.push(a, b, c, d);
  }

  public write5(a: number, b: number, c: number, d: number, e: number): void {
    this.writes.push(a, b, c, d, e);
  }

  public separator(): void {
    this.writes.push(',');
  }

  public newline(): void {
    this.writes.push(';');
  }

  get length(): number {
    return this.writes.length;
  }
}

describe('Encoder', () => {
  let encoder: Encoder;
  let mapper: MappingsEncoder;
  let mapping: { col: number, src: number, srcLine: number, srcCol: number, name: number };

  beforeEach( () => {
    encoder = new Encoder();
    mapper = new MappingsEncoder(encoder);

    mapping = {
      col: 197,
      name: 2,
      src: 0,
      srcCol: 29,
      srcLine: 7,
    };
  });

  describe('write1', () => {
    it('writes the `col` field', () => {
      expect(encoder.writes).to.deep.equal([]);

      mapper.write1(mapping);

      expect(encoder.writes).to.deep.equal([ 197 ]);
    });
  });

  describe('write4', () => {
    it('writes the col, src, srcLine and srcCol fields in order', () => {
      expect(encoder.writes).to.deep.equal([]);

      mapper.write4(mapping);

      expect(encoder.writes).to.deep.equal([ 197, 0, 7, 29 ]);
    });
  });

  describe('write5', () => {
    it('writes the col, src, srcLine, srcCol and name fields in order', () => {
      expect(encoder.writes).to.deep.equal([]);

      mapper.write5(mapping);

      expect(encoder.writes).to.deep.equal([ 197, 0, 7, 29, 2 ]);
    });
  });

  describe('encode', () => {
    it('encodes sequences of the same field length', () => {
      expect(encoder.writes).to.deep.equal([]);

      mapper.encode([[{
        col: 105,
        fieldCount: 1,
        name: 0,
        src: 0,
        srcCol: 0,
        srcLine: 0,
      }, {
        col: 200,
        fieldCount: 1,
        name: 0,
        src: 0,
        srcCol: 0,
        srcLine: 0,
      }, {
        col: 300,
        fieldCount: 1,
        name: 0,
        src: 0,
        srcCol: 0,
        srcLine: 0,
      }]]);

      expect(encoder.writes).to.deep.equal([ 105, ',', 95, ',', 100 ]);
    });

    it('encodes sequences of mixed field lengths', () => {
      expect(encoder.writes).to.deep.equal([]);

      mapper.encode([[{
        col: 10,
        fieldCount: 5,
        name: 14,
        src: 11,
        srcCol: 13,
        srcLine: 12,
      }, {
        col: 20,
        fieldCount: 1,
        name: 0,
        src: 0,
        srcCol: 0,
        srcLine: 0,
      }, {
        col: 30,
        fieldCount: 4,
        name: 0,
        src: 31,
        srcCol: 33,
        srcLine: 32,
      }]]);

      expect(encoder.writes).to.deep.equal([
        10, 11, 12, 13, 14, ',',
        10, ',',
        10, 20, 20, 20,
      ]);
    });

    it('encodes multiple lines with single segments', () => {
      expect(encoder.writes).to.deep.equal([]);

      mapper.encode([[
        {
          col: 10,
          fieldCount: 1,
          name: 0,
          src: 0,
          srcCol: 0,
          srcLine: 0,
        }, {
          col: 20,
          fieldCount: 1,
          name: 0,
          src: 0,
          srcCol: 0,
          srcLine: 0,
        },
      ], [
        {
          col: 100,
          fieldCount: 1,
          name: 0,
          src: 0,
          srcCol: 0,
          srcLine: 0,
        },
      ]]);

      expect(encoder.writes).to.deep.equal([
        10, ',', 10, ';',
        100,
      ]);
    });

    it('encodes multiple lines with multiple mixed segments', () => {
      expect(encoder.writes).to.deep.equal([]);

      mapper.encode([[
        {
          col: 10,
          fieldCount: 1,
          name: 0,
          src: 0,
          srcCol: 0,
          srcLine: 0,
        }, {
          col: 20,
          fieldCount: 1,
          name: 0,
          src: 0,
          srcCol: 0,
          srcLine: 0,
        },
      ], [
        {
          col: 100,
          fieldCount: 5,
          name: 104,
          src: 101,
          srcCol: 103,
          srcLine: 102,
        },
      ], [
        {
          col: 200,
          fieldCount: 4,
          name: 0,
          src: 201,
          srcCol: 203,
          srcLine: 202,
        }, {
          col: 300,
          fieldCount: 4,
          name: 0,
          src: 301,
          srcCol: 303,
          srcLine: 302,
        },
      ]]);

      expect(encoder.writes).to.deep.equal([
        10, ',', 10, ';',
        100, 101, 102, 103, 104, ';',
        200, 100, 100, 100, ',', 100, 100, 100, 100,
      ]);
    });
  });
});
