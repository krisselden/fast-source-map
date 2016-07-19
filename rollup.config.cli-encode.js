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
  entry: 'lib/cli/encode-source-map.js',
  plugins: [index],
  format: 'cjs',
  dest: 'dist/cli/encode-source-map.js',
  sourceMap: 'dist/cli/encode-source-map.js.map',
  external: [DIST]
};
