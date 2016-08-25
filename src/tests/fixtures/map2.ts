export default {
  version: "3",
  sources: [
    "test/fixtures/inner/second.js",
  ],
  sourcesContent: [
    "function somethingElse() {\n  throw new Error(\"somethign else\");\n}\n",
  ],
  names: [],
  mappings: [
    [
      {
        "fieldCount": 4,
        "col": 0,
        "src": 0,
        "srcLine": 0,
        "srcCol": 0,
      },
    ],
    [
      {
        "fieldCount": 4,
        "col": 0,
        "src": 0,
        "srcLine": 1,
        "srcCol": 0,
      },
    ],
    [
      {
        "fieldCount": 4,
        "col": 0,
        "src": 0,
        "srcLine": 2,
        "srcCol": 0,
      },
    ],
  ],
  file: "map2.js",
};
