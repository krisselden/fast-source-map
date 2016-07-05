import concat from '../src/concat';

import map1 from './fixtures/map1';
import map2 from './fixtures/map2';
import map1_2 from './fixtures/map1-2';
import map3_4 from './fixtures/map3-4';
import map3_4_1 from './fixtures/map3-4-1';

var expect = require('chai').expect;
var merge = require('lodash.merge');

describe('concat()', function() {
  it('can output an empty source map', function() {
    expect(concat([])).to.deep.equal({
      version: '3',
      sources: [],
      sourcesContent: [],
      names: [],
      mappings: { lines: [] },
      file: '',
    }, 'concatenator can output the empty case');
  });

  it('can output a single source map', function() {
    var map1 = {
      version: "3",
      sources: [ 'file1.js' ],
      sourcesContent: [],
      names: [],
      mappings: {
        lines: [ {
          mappings: [ {
            col: 0,
            src: 0,
            srcLine: 1,
            srcCol: 0,
          } ],
        } ],
      },
      file: 'map1.js',
    };

    expect(concat([map1])).to.deep.equal({
      version: '3',
      sources: [ 'file1.js' ],
      sourcesContent: [],
      names: [],
      mappings: {
        lines: [ {
          mappings: [ {
            col: 0,
            src: 0,
            srcLine: 1,
            srcCol: 0,
          } ],
        } ],
      },
      file: '',
    }, 'concatenator can output a single source map');
  });

  it('can produce simple merged source maps', function() {
    expect(concat([map1, map2])).to.deep.equal(map1_2);
  });

  it('can merge source maps with multiple sources', function() {
    expect(concat([map3_4, map1])).to.deep.equal(map3_4_1);
  });
});

