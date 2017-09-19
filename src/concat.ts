import { DecodedMappings, DecodedSourceMap } from './interfaces';

/**
 * A function that concatenates source maps.
 *
 * Source maps are expected to be in the following format:
 *
 * ```js
 *   {
 *     version: <source-map version>,
 *     sources: [],
 *     sourcesContent: [],
 *     names: [],
 *     mappings: [
 *       [{
 *         col: <position in output line>,
 *         src: <position in sources array>,
 *         srcLine: <line within source>,
 *         srcCol: <column within source line>,
 *       }]
 *     ],
 *     file:
 *   }
 * ```
 */
export default function concat(maps: DecodedSourceMap[]): DecodedSourceMap {
  const sources: string[] = maps.reduce((acc: string[], map: DecodedSourceMap) => {
    return acc.concat(map.sources);
  }, []);
  const sourcesContent = maps.reduce((acc: string[], map: DecodedSourceMap) => {
    return acc.concat(map.sourcesContent);
  }, []);
  const names = maps.reduce((acc: string[], map: DecodedSourceMap) => {
    return acc.concat(map.names);
  }, []);

  let srcOffset = 0;
  let nameOffset = 0;
  const mappings = maps.reduce((acc: DecodedMappings, map) => {
    acc = acc.concat(map.mappings.map((lineMappings) => {
      return lineMappings.map((mapping) => ({
        col: mapping.col,
        fieldCount: mapping.fieldCount,
        name: mapping.name + nameOffset,
        src: mapping.src + srcOffset,
        srcCol: mapping.srcCol,
        srcLine: mapping.srcLine,
      }));
    }));

    srcOffset += map.sources.length;
    nameOffset += map.names.length;

    return acc;
  }, []);

  return {
    file: '',
    mappings,
    names,
    sources,
    sourcesContent,
    version: '3',
  };
}
