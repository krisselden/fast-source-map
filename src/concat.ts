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
        lines: [
          [{
            col: <position in output line>,
            src: <position in sources array>,
            srcLine: <line within source>,
            srcCol: <column within source line>,
          }]
        ],
      },
      file:
    }
  ```

*/
export default function concat(maps: DecodedSourceMap[]): DecodedSourceMap {
  let sources: string[] = maps.reduce((acc: string[], map: DecodedSourceMap) => {
    return acc.concat(map.sources);
  }, []);
  let sourcesContent = maps.reduce((acc: string[], map: DecodedSourceMap) => {
    return acc.concat(map.sourcesContent);
  }, []);
  let names = maps.reduce((acc: string[], map: DecodedSourceMap) => {
    return acc.concat(map.names);
  }, []);

  let offset = 0;
  let mappings = maps.reduce((acc: DecodedMappings, map) => {
    acc.lines = acc.lines.concat(map.mappings.lines.map(lineMappings => {
      return lineMappings.map(mapping => ({
        fieldCount: mapping.fieldCount,
        col: mapping.col,
        src: mapping.src + offset,
        srcLine: mapping.srcLine,
        srcCol: mapping.srcCol,
      }));
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
