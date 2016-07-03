import Concatenator from '../src/concatenator';

import map1 from './fixtures/map1';
import map2 from './fixtures/map2';
import map1_2 from './fixtures/map1-2';
import map3_4 from './fixtures/map3-4';
import map3_4_1 from './fixtures/map3-4-1';

var expect = require('chai').expect;
var merge = require('lodash.merge');

describe('Concatenator', function() {
  let concatenator;

  beforeEach(function() {
    concatenator = new Concatenator();
  });

  describe('toJSON()', function() {
    it('can output an empty source map', function() {
      expect(concatenator.toJSON()).to.deep.equal({
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

      concatenator.push(map1);

      expect(concatenator.toJSON()).to.deep.equal({
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
      concatenator.push(map1);
      concatenator.push(map2);

      expect(concatenator.toJSON()).to.deep.equal(map1_2);
    });

    it('can merge source maps with multiple sources', function() {
      concatenator.push(map3_4);
      concatenator.push(map1);

      expect(concatenator.toJSON()).to.deep.equal(map3_4_1);
    });
  });

  describe('splice()', function() {
    it('can splice mappings', function() {
      // [map1, map2]
      concatenator.splice(0, 0, map1, map2);
      expect(concatenator.toJSON()).to.deep.equal(map1_2);

      // [map2]
      concatenator.splice(0, 1);
      expect(concatenator.toJSON()).to.deep.equal(merge({}, map2, { file: '' }));

      // [map2]
      concatenator.splice(0, 0, map1);
      expect(concatenator.toJSON()).to.deep.equal(map1_2);
    });
  });
});

