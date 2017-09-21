typedef struct Reader {
  int pos;
  const unsigned char *bytes;
  int length;
} Reader;

int decodeVLQ(Reader *reader);

void decode(Reader *reader);

void emitNewline();
void emitMapping1(int column);
void emitMapping4(int column, int source, int sourceLine, int sourceColumn);
void emitMapping5(int column, int source, int sourceLine, int sourceColumn, int name);
