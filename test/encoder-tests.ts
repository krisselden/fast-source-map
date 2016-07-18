import MappingsEncoder from "../src/mappings-encoder";
import { Delegate } from "../src/mappings-encoder";

const expect = require("chai").expect;

class Encoder implements Delegate {
  writes: string[] = [];

  write1(n): void {
    this.writes.push(n);
  }

  write4(a, b, c, d): void {
    this.writes.push(a, b, c, d);
  }

  write5(a, b, c, d, e): void {
    this.writes.push(a, b, c, d, e);
  }

  separator(): void {
    this.writes.push(",");
  }

  newline(): void {
    this.writes.push(";");
  }

  get length(): number {
    return this.writes.length;
  }
}

describe("Encoder", function() {
  let encoder: Encoder;
  let mapper: MappingsEncoder;
  let mapping;

  beforeEach( function() {
    encoder = new Encoder();
    mapper = new MappingsEncoder(encoder);

    mapping = {
      col: 197,
      src: 0,
      srcLine: 7,
      srcCol: 29,
      name: 2,
    };
  });

  describe("write1", function() {
    it("writes the `col` field", function() {
      expect(encoder.writes).to.deep.equal([]);

      mapper.write1(mapping);

      expect(encoder.writes).to.deep.equal([ 197 ]);
    });
  });

  describe("write4", function() {
    it("writes the col, src, srcLine and srcCol fields in order", function() {
      expect(encoder.writes).to.deep.equal([]);

      mapper.write4(mapping);

      expect(encoder.writes).to.deep.equal([ 197, 0, 7, 29 ]);
    });
  });

  describe("write5", function() {
    it("writes the col, src, srcLine, srcCol and name fields in order", function() {
      expect(encoder.writes).to.deep.equal([]);

      mapper.write5(mapping);

      expect(encoder.writes).to.deep.equal([ 197, 0, 7, 29, 2 ]);
    });
  });

  describe("encode", function() {
    it("encodes sequences of the same field length", function() {
      expect(encoder.writes).to.deep.equal([]);

      mapper.encode({
        lines: [ {
          mappings: [ {
            fieldCount: 1,
            col: 105,
            src: 0,
            srcLine: 0,
            srcCol: 0,
            name: 0
          }, {
            fieldCount: 1,
            col: 200,
            src: 0,
            srcLine: 0,
            srcCol: 0,
            name: 0
          }, {
            fieldCount: 1,
            col: 300,
            src: 0,
            srcLine: 0,
            srcCol: 0,
            name: 0
          } ],
        } ],
      });

      expect(encoder.writes).to.deep.equal([ 105, ",", 95, ",", 100 ]);
    });

    it("encodes sequences of mixed field lengths", function() {
      expect(encoder.writes).to.deep.equal([]);

      mapper.encode({
        lines: [ {
          mappings: [ {
            fieldCount: 5,
            col: 10,
            src: 11,
            srcLine: 12,
            srcCol: 13,
            name: 14,
          }, {
            fieldCount: 1,
            col: 20,
            src: 0,
            srcLine: 0,
            srcCol: 0,
            name: 0
          }, {
            fieldCount: 4,
            col: 30,
            src: 31,
            srcLine: 32,
            srcCol: 33,
            name: 0
          } ],
        } ],
      });

      expect(encoder.writes).to.deep.equal([
        10, 11, 12, 13, 14, ",",
        10, ",",
        10, 20, 20, 20,
      ]);
    });

    it("encodes multiple lines with single segments", function() {
      expect(encoder.writes).to.deep.equal([]);

      mapper.encode({
        lines: [ {
          mappings: [ {
            fieldCount: 1,
            col: 10,
            src: 0,
            srcLine: 0,
            srcCol: 0,
            name: 0
          }, {
            fieldCount: 1,
            col: 20,
          } ],
        }, {
          mappings: [ {
            fieldCount: 1,
            col: 100,
            src: 0,
            srcLine: 0,
            srcCol: 0,
            name: 0
          } ],
        } ],
      });

      expect(encoder.writes).to.deep.equal([
        10, ",", 10, ";",
        100,
      ]);
    });

    it("encodes multiple lines with multiple mixed segments", function() {
      expect(encoder.writes).to.deep.equal([]);

      mapper.encode({
        lines: [ {
          mappings: [ {
            fieldCount: 1,
            col: 10,
            src: 0,
            srcLine: 0,
            srcCol: 0,
            name: 0
          }, {
            fieldCount: 1,
            col: 20,
            src: 0,
            srcLine: 0,
            srcCol: 0,
            name: 0
          } ],
        }, {
          mappings: [ {
            fieldCount: 5,
            col: 100,
            src: 101,
            srcLine: 102,
            srcCol: 103,
            name: 104,
          } ],
        }, {
          mappings: [ {
            fieldCount: 4,
            col: 200,
            src: 201,
            srcLine: 202,
            srcCol: 203,
            name: 0
          }, {
            fieldCount: 4,
            col: 300,
            src: 301,
            srcLine: 302,
            srcCol: 303,
            name: 0
          } ],
        } ],
      });

      expect(encoder.writes).to.deep.equal([
        10, ",", 10, ";",
        100, 101, 102, 103, 104, ";",
        200, 100, 100, 100, ",", 100, 100, 100, 100,
      ]);
    });
  });
});


