#include <stdbool.h>

unsigned char asciiToUint6[127] = {
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,62,0,0,0,63,52,53,54,55,56,57,58,59,60,61,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,0,0,0,0,0,0,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,0,0,0,0
};

int decodeVLQ(const unsigned char *bytes) {
  int num = 0;
  int shift = 0;
  int digit = 0;
  bool cont = false;
  bool negate = false;
  do {
    digit  = asciiToUint6[*bytes++ & 0x7F];
    cont   = digit & 32;
    digit  = digit & 31;
    if (shift == 0) {
      negate = digit & 1;
      num = digit >> 1;
      shift = 4;
    } else {
      num |= digit << shift;
      shift += 5;
    }
  } while (cont && shift < 30);

  return negate ? -num : num;
}
