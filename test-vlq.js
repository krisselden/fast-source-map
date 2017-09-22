const createDecoder = require('./vlq').createDecoder;

createDecoder({
  emitNewline() {
    console.log('emitNewline');
  },
  emitMapping1(col) {
    console.log('emitMapping1', col);
  },
  emitMapping4(col, src, srcLine, srcCol) {
    console.log('emitMapping4', col, src, srcLine, srcCol);
  },
  emitMapping5(col, src, srcLine, srcCol, name) {
    console.log('emitMapping5', col, src, srcLine, srcCol, name);
  },
}).then(decoder => {
  console.log('decodeVLQ', decoder.decodeVLQ('m766qH'));
  console.log('decodeVLQ', decoder.decodeVLQ('lth4ypC'));
  console.log('test decode mappings');
  decoder.decode('uLAOA,SAASA,GAAcC,EAAMC,EAAIC,GACjC,OAAUF;;GACV,IAAS,SAAT,MAA0B,IAAIG,GAAOF,EAAIC,EAAzC,KACS,cAAT,MAA+B');
});
