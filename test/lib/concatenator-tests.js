import Concatenator from '../../lib/concatenator';

var expect = require('chai').expect;
var merge = require('lodash.merge');

const map1 = {
  version: "3",
  sources: [ "test/fixtures/inner/first.js" ],
  sourcesContent: [
    "function meaningOfLife() {\n  throw new Error(42);\n}\n\nfunction boom() {\n  throw new Error('boom');\n}\n",
  ],
  names: [],
  mappings: {
    "lines": [
      {
        "mappings": [
          {
            "col": 0,
            "src": 0,
            "srcLine": 0,
            "srcCol": 0,
          },
        ],
      },
      {
        "mappings": [
          {
            "col": 0,
            "src": 0,
            "srcLine": 1,
            "srcCol": 0,
          },
        ],
      },
      {
        "mappings": [
          {
            "col": 0,
            "src": 0,
            "srcLine": 2,
            "srcCol": 0,
          },
        ],
      },
      {
        "mappings": [
          {
            "col": 0,
            "src": 0,
            "srcLine": 3,
            "srcCol": 0,
          },
        ],
      },
      {
        "mappings": [
          {
            "col": 0,
            "src": 0,
            "srcLine": 4,
            "srcCol": 0,
          },
        ],
      },
      {
        "mappings": [
          {
            "col": 0,
            "src": 0,
            "srcLine": 5,
            "srcCol": 0,
          },
        ],
      },
      {
        "mappings": [
          {
            "col": 0,
            "src": 0,
            "srcLine": 6,
            "srcCol": 0,
          },
        ],
      },
    ],
  },
  file: 'map1.js',
};

const map2 = {
  version: "3",
  sources: [
    "test/fixtures/inner/second.js",
  ],
  sourcesContent: [
    "function somethingElse() {\n  throw new Error(\"somethign else\");\n}\n",
  ],
  names: [],
  mappings: {
    "lines": [
      {
        "mappings": [
          {
            "col": 0,
            "src": 0,
            "srcLine": 0,
            "srcCol": 0,
          },
        ],
      },
      {
        "mappings": [
          {
            "col": 0,
            "src": 0,
            "srcLine": 1,
            "srcCol": 0,
          },
        ],
      },
      {
        "mappings": [
          {
            "col": 0,
            "src": 0,
            "srcLine": 2,
            "srcCol": 0,
          },
        ],
      },
    ],
  },
  file: 'map2.js',
};

const map1_2 = {
  version: '3',
  sources: [
    "test/fixtures/inner/first.js",
    "test/fixtures/inner/second.js",
  ],
  sourcesContent: [
    "function meaningOfLife() {\n  throw new Error(42);\n}\n\nfunction boom() {\n  throw new Error('boom');\n}\n",
    "function somethingElse() {\n  throw new Error(\"somethign else\");\n}\n",
  ],
  names: [],
  mappings: {
    "lines": [
      // first.js mappings
      {
        "mappings": [
          {
            "col": 0,
            "src": 0,
            "srcLine": 0,
            "srcCol": 0,
          },
        ],
      },
      {
        "mappings": [
          {
            "col": 0,
            "src": 0,
            "srcLine": 1,
            "srcCol": 0,
          },
        ],
      },
      {
        "mappings": [
          {
            "col": 0,
            "src": 0,
            "srcLine": 2,
            "srcCol": 0,
          },
        ],
      },
      {
        "mappings": [
          {
            "col": 0,
            "src": 0,
            "srcLine": 3,
            "srcCol": 0,
          },
        ],
      },
      {
        "mappings": [
          {
            "col": 0,
            "src": 0,
            "srcLine": 4,
            "srcCol": 0,
          },
        ],
      },
      {
        "mappings": [
          {
            "col": 0,
            "src": 0,
            "srcLine": 5,
            "srcCol": 0,
          },
        ],
      },
      {
        "mappings": [
          {
            "col": 0,
            "src": 0,
            "srcLine": 6,
            "srcCol": 0,
          },
        ],
      },
      // second.js mappings
      {
        "mappings": [
          {
            "col": 0,
            "src": 1,
            "srcLine": 0,
            "srcCol": 0,
          },
        ],
      },
      {
        "mappings": [
          {
            "col": 0,
            "src": 1,
            "srcLine": 1,
            "srcCol": 0,
          },
        ],
      },
      {
        "mappings": [
          {
            "col": 0,
            "src": 1,
            "srcLine": 2,
            "srcCol": 0,
          },
        ],
      },
    ],
  },
  file: '',
};


describe('Concatenator.prototype.toJSON', () => {
  it('can output an empty source map', () => {
    let concatenator = new Concatenator();

    expect(concatenator.toJSON()).to.deep.equal({
      version: '3',
      sources: [],
      sourcesContent: [],
      names: [],
      mappings: { lines: [] },
      file: '',
    }, 'concatenator can output the empty case');
  });

  it('can output a single source map', () => {
    var concatenator = new Concatenator();

    var map1 = {
      version: "3",
      sources: [ 'file1.js' ],
      sourcesContent: [],
      names: [],
      mappings: {
        lines: [ {
          mappings: [ {
            col: 0,
            src: 0,
            srcLine: 1,
            srcCol: 0,
          } ],
        } ],
      },
      file: 'map1.js',
    };

    concatenator.push(map1);

    expect(concatenator.toJSON()).to.deep.equal({
      version: '3',
      sources: [ 'file1.js' ],
      sourcesContent: [],
      names: [],
      mappings: {
        lines: [ {
          mappings: [ {
            col: 0,
            src: 0,
            srcLine: 1,
            srcCol: 0,
          } ],
        } ],
      },
      file: '',
    }, 'concatenator can output a single source map');
  });

  it('can produce simple merged source maps', () => {
    var concatenator = new Concatenator();

    concatenator.push(map1);
    concatenator.push(map2);

    expect(concatenator.toJSON()).to.deep.equal(map1_2);
  });
});

describe('Concatenator.prototype.splice', () => {
  it('can splice mappings', () => {
    var concatenator = new Concatenator();

    // [map1, map2]
    concatenator.splice(0, 0, map1, map2);
    expect(concatenator.toJSON()).to.deep.equal(map1_2);

    // [map2]
    concatenator.splice(0, 1);
    expect(concatenator.toJSON()).to.deep.equal(merge({}, map2, { file: '' }));

    // [map2]
    concatenator.splice(0, 0, map1);
    expect(concatenator.toJSON()).to.deep.equal(map1_2);
  });
});

