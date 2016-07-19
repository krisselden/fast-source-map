var DIST = __dirname + '/dist/index';

var index = {
  resolveId: function (importee, importer) {
    if (importee === '../index') {
      return DIST;
    }
    // fallthrough
  }
};

export default {
  entry: 'lib/cli/decode-source-map.js',
  plugins: [index],
  format: 'cjs',
  dest: 'dist/cli/decode-source-map.js',
  sourceMap: 'dist/cli/decode-source-map.js.map',
  external: [DIST]
};
