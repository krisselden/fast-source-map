export default {
  file: '',
  mappings: [
    // first.js mappings
    [
      {
        col: 0,
        fieldCount: 4,
        name: 0,
        src: 0,
        srcCol: 0,
        srcLine: 0,
      },
    ],
    [
      {
        col: 0,
        fieldCount: 4,
        name: 0,
        src: 0,
        srcCol: 0,
        srcLine: 1,
      },
    ],
    [
      {
        col: 0,
        fieldCount: 4,
        name: 0,
        src: 0,
        srcCol: 0,
        srcLine: 2,
      },
    ],
    [
      {
        col: 0,
        fieldCount: 4,
        name: 0,
        src: 0,
        srcCol: 0,
        srcLine: 3,
      },
    ],
    [
      {
        col: 0,
        fieldCount: 4,
        name: 0,
        src: 0,
        srcCol: 0,
        srcLine: 4,
      },
    ],
    [
      {
        col: 0,
        fieldCount: 4,
        name: 0,
        src: 0,
        srcCol: 0,
        srcLine: 5,
      },
    ],
    [
      {
        col: 0,
        fieldCount: 4,
        name: 0,
        src: 0,
        srcCol: 0,
        srcLine: 6,
      },
    ],
    // second.js mappings
    [
      {
        col: 0,
        fieldCount: 4,
        name: 0,
        src: 1,
        srcCol: 0,
        srcLine: 0,
      },
    ],
    [
      {
        col: 0,
        fieldCount: 4,
        name: 0,
        src: 1,
        srcCol: 0,
        srcLine: 1,
      },
    ],
    [
      {
        col: 0,
        fieldCount: 4,
        name: 0,
        src: 1,
        srcCol: 0,
        srcLine: 2,
      },
    ],
  ],
  names: [] as string[],
  sources: [
    'test/fixtures/inner/first.js',
    'test/fixtures/inner/second.js',
  ],
  sourcesContent: [
    'function meaningOfLife() {\n  throw new Error(42);\n}\n\nfunction boom() {\n  throw new Error(\'boom\');\n}\n',
    'function somethingElse() {\n  throw new Error("somethign else");\n}\n',
  ],
  version: '3',
};
