## fast-source-map

WIP library for faster source-map decoding/encoding.  Currently only does the mappings, over time will add more features of mozilla source-map.

Right now you have to convert the mappings string to an array and back again, but eventually the idea will be a data structure that does not decode the string at all, but just tokenizes the json into pointers within the buffer.

But even with having to convert the string to and from an array, for large mappings this is still significantly faster than the source-map module.

Look at the unit tests for an example.
