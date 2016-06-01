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
export default function Concatenator() {
  if (!(this instanceof Concatenator)) {
    throw new TypeError('Use `new VLQ.Concatenator`');
  }

  /**
    Contains the raw decoded input source maps.
  */
  this.maps = [];

  /**
    Contains concatenated maps.

    `concatenatedMaps[i]` is the
  */
  // this.concatenatedMaps = [];

  // this.validAdjustedMappingsIndex = 0;
}

Concatenator.prototype = {
  push(sourceMap) {
    this.maps.push(sourceMap);
  },

  splice() {
    this.maps.splice.apply(this.maps, arguments);
  },

  toJSON(options) {
    options = options || {};
    var encode = ! (options.encode === false);

    var sources = this.maps.reduce(function (acc, map) {
      return acc.concat(map.sources);
    }, []);

    var sourcesContent = this.maps.reduce(function (acc, map) {
      return acc.concat(map.sourcesContent);
    }, []);

    var names = this.maps.reduce(function (acc, map) {
      return acc.concat(map.names);
    }, []);

    var offset = 0;
    var mappings = this.maps.reduce(function (acc, map) {
      acc.lines = acc.lines.concat(map.mappings.lines.map(function (lineMappings) {
        var transformedLineMappings = lineMappings.mappings.map(function (mapping) {
          return {
            col: mapping.col,
            src: mapping.src + offset,
            srcLine: mapping.srcLine,
            srcCol: mapping.srcCol,
          };
        });

        return {
          mappings: transformedLineMappings,
        };
      }));

      offset += 1;

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
  },
};
