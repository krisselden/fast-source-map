export let uint6ToASCII = new Uint8Array(64);
export let asciiToUint6 = new Uint8Array(127);

let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for (let i = 0; i < 64; i++) {
  let ascii = chars.charCodeAt(i);
  uint6ToASCII[i] = ascii;
  asciiToUint6[ascii] = i;
}
