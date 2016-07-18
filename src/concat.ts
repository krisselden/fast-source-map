import { DecodedSourceMap, DecodedMappings } from "./interfaces";

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
export default function concat(maps: Array<DecodedSourceMap>): DecodedSourceMap {
  let sources = maps.reduce((acc, map) => acc.concat(map.sources), []);
  let sourcesContent = maps.reduce((acc, map) => acc.concat(map.sourcesContent), []);
  let names = maps.reduce((acc, map) => acc.concat(map.names), []);

  let offset = 0;
  let mappings = maps.reduce((acc: DecodedMappings, map) => {
    acc.lines = acc.lines.concat(map.mappings.lines.map(lineMappings => {
      let transformedLineMappings = lineMappings.mappings.map(mapping => ({
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
    version: "3",
    sources,
    sourcesContent,
    names,
    mappings,
    file: "",
  };
}
