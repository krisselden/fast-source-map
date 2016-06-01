# Fast Source Map

Keeping the JIT gods happy since circa 2015

When working with sourcemaps, VLQ encoding and decoding typically dominiates
cost. To address this, this library provides a Fast VLQ encoder & decoder for
JavaScript.  By reducing allocations, minimizing transformations, and writing
JIT friendly code we are able to drammatically improve performance.

How much faster? At the time this README was written, decoding scala.js.map took:

```
v8: 4.6.85.28
node: 5.0.0
os: 10.10.3
hw: 2.5 GHz Intel Core i7, 16gb
```

* source-map: ~5,000ms
* fast-source-map ~ 500ms

# Usage

First we will need to have our `sourceMap.mappings` stored as a buffer. We have
future plans to work directly on a sourceMap buffer, as that will allow for
more ideal performance. Even without, the performance improvements are still
well worth it.

It's also worth noting, this is considered a fairly low level API. Ergonomics
can still be improved!

```js
var buffer = /* try to leave the map inert, and in buffer form. Otherwise convert to buffer */
```

Typically, the following steps are required:


```js
var map = JSON.parse(fs.readFileSync('path/to/source/to/decode.js.map'));
var toBuffer = require('string2buffer');

var buffer = toBuffer(map.mappings);
```

Setup the reader and decoder

```js
// setup the reader
var reader = new VLQ.IntBufferReader(buffer, 0, buffer.length);
var decoder = new VLQ.Decoder();
var mappingsDecoder = new VLQ.MappingsDecoder(decoder);
```

Now for some actual decoding

```js
mappingsDecoder.decode(reader);
decoder.mappings // => is the quickly decoded
```


To concatenate multiple source maps

```js
var toBuffer = require('string2buffer');
var decodeFile = VLQ.decodeFile;

var concatenator = new VLQ.SourceMapConcatenator();
concatenator.push(decodeFile('path/to/file-1.js.map'));
concatenator.push(decodeFile('path/to/file-2.js.map'));
concatenator.push(decodeFile('path/to/file-3.js.map'));

concatenator.toJSON(); // => the concatenated source maps
```

Now to reconcatenate the source maps after a source file is removed.

```js
// file-2.js.map is removed
concatenator.splice(1, 1);
concatenator.toJSON(); // => the concatenated source maps
```

And reconcatenate again after adding back other files.

```js
// an updated file 2 and a new file 4 are added
concatenator.splice(1, 0, decodeFile('path/to/file-2-updated.js.map'));
concatenator.push(decodeFile('path/to/file-4.js.map'));
concatenator.toJSON(); // => the concatenated source maps
```

