const createDecoder = require('../vlq').createDecoder;
const assert = require('assert');
const fs = require('fs');

class CountDelegate {
  constructor() {
    this.lines = 1;
  }

  reset() {
    this.lines = 1;
  }

  emitNewline() {
    this.lines++;
  }

  emitMapping1(col) {
  }

  emitMapping4(col, src, srcLine, srcCol) {
  }

  emitMapping5(col, src, srcLine, srcCol, name) {
  }
}

class Delegate {
  constructor() {
    this.currentLine = [];
    this.mappings = [this.currentLine];
  }

  reset() {
    this.currentLine.length = 0;
    this.mappings.length = 1;
  }

  emitNewline() {
    this.mappings.push(this.currentLine = []);
  }

  emitMapping1(col) {
    this.currentLine.push({
      col: col,
      fieldCount: 1,
      name: 0,
      src: 0,
      srcCol: 0,
      srcLine: 0,
    });
  }

  emitMapping4(col, src, srcLine, srcCol) {
    this.currentLine.push({
      col: col,
      fieldCount: 4,
      name: 0,
      src: src,
      srcCol: srcCol,
      srcLine: srcLine,
    });
  }

  emitMapping5(col, src, srcLine, srcCol, name) {
    this.currentLine.push({
      col: col,
      fieldCount: 5,
      name: name,
      src: src,
      srcCol: srcCol,
      srcLine: srcLine,
    });
  }
}

const noop = !!process.env.NOOP
const delegate = noop ? new CountDelegate() : new Delegate();

createDecoder(delegate).then(decoder => {
  function test() {
    delegate.reset();

    const parsed = JSON.parse(fs.readFileSync('bench/scala.js.map', 'utf8'));
    const start = Date.now();

    decoder.decode(parsed.mappings);

    return {
      duration: Date.now() - start
    };
  }

  console.log('warmup run:', test().duration + 'ms'); // warm up

  if (noop) {
    assert(delegate.lines === 379201, 'correct number of lines');
  } else {
    // make sure the output appears reasonable
    console.log(delegate.mappings.length);
    assert(delegate.mappings.length === 379201, 'correct number of lines');
    assert.deepEqual(delegate.mappings[0],
      [
        { fieldCount: 4, col: 0, src: 0, srcLine: 0, srcCol: 0, name: 0 },
      ],
    );
    assert.deepEqual(delegate.mappings[379200], []);
  }

  function doTest(i) {
    return () => delay(500).then(() => {
      console.log(`run ${i}: ${test().duration}ms`);
    });
  }

  let chain = Promise.resolve();
  for (let i = 0; i < 20; i++) {
    chain.then(doTest(i + 1))
  }
  return chain;
});

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      delegate.reset();
      if (typeof gc === 'function') gc(true);
      setTimeout(resolve, ms);
    }, 10);
  });
}
