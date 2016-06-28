import multiEntry from 'rollup-plugin-multi-entry';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'test/lib/*.js',
  plugins: [ babel(), multiEntry() ],
};
