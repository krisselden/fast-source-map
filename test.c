#include "vlq.h"
#include <stdio.h>

int main(int argc, char *argv[]) {
  const char *str;
  if (argc > 1) {
    str = argv[1];
  } else {
    str = "lth4ypC";
  }
  printf("decodeVLQ(\"%s\") -> %d\n", str, decodeVLQ((const unsigned char *)str));
}
