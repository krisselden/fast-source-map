const fs = require('fs');

WebAssembly.compile(fs.readFileSync('vlq.wasm')).then(mod => {
  return WebAssembly.instantiate(mod, {});
}).then(instance => {
  const decodeVLQ = instance.exports.decodeVLQ;
  debugger;
  const bytes = new Uint8Array(instance.exports.memory.buffer);
  const a = 'm766qH';
  const b = 'lth4ypC';
  const chars = a + b;
  for (let i = 0; i < chars.length; i++) {
    bytes[512 + i] = chars.charCodeAt(i);
  }
  console.log(decodeVLQ(512));
  console.log(decodeVLQ(512 + a.length));
});
