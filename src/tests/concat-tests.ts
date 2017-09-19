import { concat } from '../index';

import { expect } from 'chai';
import map1 from './fixtures/map1';
import map1_2 from './fixtures/map1-2';
import map2 from './fixtures/map2';
import map3_4 from './fixtures/map3-4';
import map3_4_1 from './fixtures/map3-4-1';

describe('concat()', () => {
  it('can output an empty source map', () => {
    expect(concat([])).to.deep.equal({
      file: '',
      mappings: [],
      names: [],
      sources: [],
      sourcesContent: [],
      version: '3',
    }, 'concatenator can output the empty case');
  });

  it('can output a single source map', () => {
    const map = {
      file: 'map1.js',
      mappings: [[{
        col: 0,
        fieldCount: 4,
        name: 0,
        src: 0,
        srcCol: 0,
        srcLine: 1,
      }]],
      names: [] as string[],
      sources: [ 'file1.js' ],
      sourcesContent: [] as string[],
      version: '3',
    };

    expect(concat([map])).to.deep.equal({
      file: '',
      mappings: [[{
        col: 0,
        fieldCount: 4,
        src: 0,
        srcCol: 0,
        srcLine: 1,
      }]],
      names: [],
      sources: [ 'file1.js' ],
      sourcesContent: [],
      version: '3',
    }, 'concatenator can output a single source map');
  });

  it('can produce simple merged source maps', () => {
    expect(concat([map1, map2])).to.deep.equal(map1_2);
  });

  it('can merge source maps with multiple sources', () => {
    expect(concat([map3_4, map1])).to.deep.equal(map3_4_1);
  });
});
