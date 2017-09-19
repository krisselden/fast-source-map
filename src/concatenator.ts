/**
 * A class for concatenating source maps.
 *
 * Soure maps are expected to be in the following format:
 *
 *  ```js
 *    {
 *      version: <source-map version>,
 *      sources: [],
 *      sourcesContent: [],
 *      names: [],
 *      mappings: {
 *        lines: [{
 *          mappings: [{
 *            col: <position in output line>,
 *            src: <position in sources array>,
 *            srcLine: <line within source>,
 *            srcCol: <column within source line>,
 *          }]
 *        }],
 *      },
 *      file:
 *    }
 *  ```
 */
export default class Concatenator {
  /**
   * Contains the raw decoded input source maps.
   */
  public maps = [];

  public push(sourceMap) {
    this.maps.push(sourceMap);
  }

  public splice() {
    this.maps.splice.apply(this.maps, arguments);
  }

  public toJSON(options) {
    options = options || {};
    const encode = ! (options.encode === false);

    const sources = this.maps.reduce((acc, map) => acc.concat(map.sources), []);
    const sourcesContent = this.maps.reduce((acc, map) => acc.concat(map.sourcesContent), []);
    const names = this.maps.reduce((acc, map) => acc.concat(map.names), []);

    let offset = 0;
    const mappings = this.maps.reduce((acc, map) => {
      acc.lines = acc.lines.concat(map.mappings.lines.map((lineMappings) => {
        const transformedLineMappings = lineMappings.mappings.map((mapping) => ({
          col: mapping.col,
          src: mapping.src + offset,
          srcCol: mapping.srcCol,
          srcLine: mapping.srcLine,
        }));

        return {
          mappings: transformedLineMappings,
        };
      }));

      offset += map.sources.length;

      return acc;
    }, { lines: [] });

    return {
      file: '',
      mappings,
      names,
      sources,
      sourcesContent,
      version: '3',
    };
  }
}
