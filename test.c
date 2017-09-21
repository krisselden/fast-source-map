#include "vlq.h"
#include <stdio.h>
#include <string.h>

void emitNewline() {
  printf("emitNewline\n");
}

void emitMapping1(int column) {
  printf("emitMapping1 %d\n", column);
}

void emitMapping4(int column, int source, int sourceLine, int sourceColumn) {
  printf("emitMapping4 %d %d %d %d\n", column, source, sourceLine, sourceColumn);
}

void emitMapping5(int column, int source, int sourceLine, int sourceColumn, int name) {
  printf("emitMapping5 %d %d %d %d %d\n", column, source, sourceLine, sourceColumn, name);
}

int main(int argc, char *argv[]) {
  const char *str;
  if (argc > 1) {
    str = argv[1];
  } else {
    str = "lth4ypC";
  }
  Reader reader;
  reader.pos = 0;
  reader.bytes = (const unsigned char *)str;
  reader.length = strlen(str);
  printf("decodeVLQ(\"%s\") -> %d\n", str, decodeVLQ(&reader));

  const char * mappings = "uLAOA,SAASA,GAAcC,EAAMC,EAAIC,GACjC,OAAUF;;GACV,IAAS,SAAT,MAA0B,IAAIG,GAAOF,EAAIC,EAAzC,KACS,cAAT,MAA+B";
  reader.pos = 0;
  reader.bytes = (const unsigned char *)mappings;
  reader.length = strlen(mappings);
  decode(&reader);
}
