export var uint6ToASCII = new Uint8Array(64);
export var asciiToUint6 = new Uint8Array(127);


var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for (var i = 0; i < 64; i++) {
  var ascii = chars.charCodeAt(i);
  uint6ToASCII[i] = ascii;
  asciiToUint6[ascii] = i;
}
