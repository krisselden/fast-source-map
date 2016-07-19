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
  entry: 'lib/tests/index.js',
  plugins: [index],
  format: 'cjs',
  dest: 'dist/tests/index.js',
  sourceMap: 'dist/tests/index.js.map',
  external: ['chai', DIST],
};
