#include "vlq.h"

unsigned char asciiToUint6[127] = {
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,62,0,0,0,63,52,53,54,55,56,57,58,59,60,61,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,0,0,0,0,0,0,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,0,0,0,0
};

int decodeVLQ(Reader *reader) {
  int num = 0;
  int shift = 0;
  int digit = 0;
  int cont = 0;
  int negate = 0;
  do {
    digit  = asciiToUint6[reader->bytes[reader->pos++] & 0x7F];
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

void emitMapping(int fieldCount, int column, int source, int sourceLine, int sourceColumn, int name) {
  switch (fieldCount) {
    case 1:
      emitMapping1(column);
      break;
    case 4:
      emitMapping4(column, source, sourceLine, sourceColumn);
      break;
    case 5:
      emitMapping5(column, source, sourceLine, sourceColumn, name);
      break;
  }
}

void decode(Reader *reader) {
  unsigned char byte;
  int fieldCount = 0;
  int line = 0;
  int column = 0;
  int source = 0;
  int sourceLine = 0;
  int sourceColumn = 0;
  int name = 0;
  int value = 0;

  while ((byte = reader->bytes[reader->pos]) != 0) {
    switch (byte) {
      case 59: // semicolon
        if (fieldCount > 0) {
          emitMapping(fieldCount, column, source, sourceLine, sourceColumn, name);
        }
        emitNewline();
        column = 0;
        fieldCount = 0;
        reader->pos++;
        break;
      case 44: // comma
        emitMapping(fieldCount, column, source, sourceLine, sourceColumn, name);
        fieldCount = 0;
        reader->pos++;
        break;
      default:
        value = decodeVLQ(reader);
        switch (fieldCount) {
          case 0:
            column += value;
            fieldCount = 1;
            break;
          case 1:
            source += value;
            fieldCount = 2;
            break;
          case 2:
            sourceLine += value;
            fieldCount = 3;
            break;
          case 3:
            sourceColumn += value;
            fieldCount = 4;
            break;
          case 4:
            name += value;
            fieldCount = 5;
            break;
        }
        break;
    }
  }
  if (fieldCount > 0) {
    emitMapping(fieldCount, column, source, sourceLine, sourceColumn, name);
  }
}
