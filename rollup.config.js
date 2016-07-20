export default {
  entry: 'lib/index.js',
  targets: [
    {
      dest: 'dist/index.js',
      sourceMap: 'dist/index.js.map',
      format: 'cjs'
    },
    {
      dest: 'dist/browser.js',
      sourceMap: 'dist/browser.js.map',
      format: 'iife',
      moduleName: 'FSM'
    }
  ]
}
