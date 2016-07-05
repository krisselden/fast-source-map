interface Reader {
  /**
   * Returns the next byte without moving the pointer.
   */
  peek(): number;

  /**
   * Returns the next byte and moves the pointer forward.
   */
  read(): number;

  /**
   * Moves the pointer forward without reading any bytes.
   */
  next(): void;

  /**
   * Returns whether the pointer has reached the end of the buffer.
   */
  hasNext(): boolean;
}

export default Reader;
