/**
  A class for concatenating source maps.

  Soure maps are expected to be in the following format:

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
export default class Concatenator {
  /**
   * Contains the raw decoded input source maps.
   */
  maps = [];

  push(sourceMap) {
    this.maps.push(sourceMap);
  }

  splice() {
    this.maps.splice.apply(this.maps, arguments);
  }

  toJSON(options) {
    options = options || {};
    var encode = ! (options.encode === false);

    var sources = this.maps.reduce((acc, map) => acc.concat(map.sources), []);
    var sourcesContent = this.maps.reduce((acc, map) => acc.concat(map.sourcesContent), []);
    var names = this.maps.reduce((acc, map) => acc.concat(map.names), []);

    var offset = 0;
    var mappings = this.maps.reduce((acc, map) => {
      acc.lines = acc.lines.concat(map.mappings.lines.map(lineMappings => {
        var transformedLineMappings = lineMappings.mappings.map(mapping => ({
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
};
