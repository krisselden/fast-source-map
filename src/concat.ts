/**
  A function that concatenates source maps.

  Source maps are expected to be in the following format:

  ```js
    {
      version: <source-map version>,
      sources: [],
      sourcesContent: [],
      names: [],
      mappings: {
        lines: [{
          mappings: [{
            col: <position in output line>,
            src: <position in sources array>,
            srcLine: <line within source>,
            srcCol: <column within source line>,
          }]
        }],
      },
      file:
    }
  ```

*/
export default function concat(maps) {
  var sources = maps.reduce((acc, map) => acc.concat(map.sources), []);
  var sourcesContent = maps.reduce((acc, map) => acc.concat(map.sourcesContent), []);
  var names = maps.reduce((acc, map) => acc.concat(map.names), []);

  var offset = 0;
  var mappings = maps.reduce((acc, map) => {
    acc.lines = acc.lines.concat(map.mappings.lines.map(lineMappings => {
      var transformedLineMappings = lineMappings.mappings.map(mapping => ({
        fieldCount: mapping.fieldCount,
        col: mapping.col,
        src: mapping.src + offset,
        srcLine: mapping.srcLine,
        srcCol: mapping.srcCol,
      }));

      return {
        mappings: transformedLineMappings,
      };
    }));

    offset += map.sources.length;

    return acc;
  }, { lines: [] });

  return {
    version: '3',
    sources,
    sourcesContent,
    names,
    mappings,
    file: '',
  };
}
