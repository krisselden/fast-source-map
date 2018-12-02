var SM = (function (exports) {
'use strict';

var uint6ToASCII = new Uint8Array(64);
var asciiToUint6 = new Uint8Array(127);
var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for (var i = 0; i < 64; i++) {
    var ascii = chars.charCodeAt(i);
    uint6ToASCII[i] = ascii;
    asciiToUint6[ascii] = i;
}

// 0 - 63 (6-bit 0 - 111111)
// 32 100000 continuation bit
// 31 011111 mask 5 bits
// 1 is the sign bit
function encodeVLQ(writer, v) {
    var num = v < 0 ? (-v << 1) | 1 : v << 1;
    var cont = false;
    do {
        var digit = num & 31;
        num >>= 5;
        cont = num > 0;
        if (cont) {
            digit |= 32;
        }
        writer.write(uint6ToASCII[digit]);
    } while (cont);
}
function decodeVLQ(reader) {
    var num = 0;
    var shift = 0;
    var digit = 0;
    var cont = 0;
    do {
        digit = asciiToUint6[reader.read()];
        cont = digit & 32;
        digit = digit & 31;
        num = num + (digit << shift);
        shift += 5;
    } while (cont > 0);
    return num & 1 ? -(num >> 1) : (num >> 1);
}

var IntBufferReader = /** @class */ (function () {
    function IntBufferReader(buf, ptr, len) {
        this.buf = buf;
        this.ptr = ptr | 0;
        this.limit = (ptr + len) | 0;
    }
    IntBufferReader.prototype.peek = function () {
        return this.buf[this.ptr | 0] | 0;
    };
    IntBufferReader.prototype.read = function () {
        var n = this.buf[this.ptr | 0] | 0;
        this.ptr = (this.ptr + 1) | 0;
        return n;
    };
    IntBufferReader.prototype.next = function () {
        this.ptr = (this.ptr + 1) | 0;
    };
    IntBufferReader.prototype.hasNext = function () {
        return this.ptr < this.limit;
    };
    return IntBufferReader;
}());

var IntBufferWriter = /** @class */ (function () {
    function IntBufferWriter(buf, ptr) {
        this.buf = buf;
        this.ptr = ptr | 0;
    }
    IntBufferWriter.prototype.write = function (n) {
        this.buf[this.ptr++] = n | 0;
    };
    Object.defineProperty(IntBufferWriter.prototype, "length", {
        get: function () {
            return this.buf.length;
        },
        enumerable: true,
        configurable: true
    });
    return IntBufferWriter;
}());

var MappingsEncoder = /** @class */ (function () {
    function MappingsEncoder(delegate) {
        this.column = 0;
        this.source = 0;
        this.sourceLine = 0;
        this.sourceColumn = 0;
        this.name = 0;
        this.delegate = delegate;
    }
    MappingsEncoder.prototype.encode = function (mappings) {
        for (var i = 0; i < mappings.length; i++) {
            var line = mappings[i];
            for (var j = 0; j < line.length; j++) {
                var mapping = line[j];
                switch (mapping.fieldCount) {
                    case 1:
                        this.write1(mapping);
                        break;
                    case 4:
                        this.write4(mapping);
                        break;
                    case 5:
                        this.write5(mapping);
                        break;
                    default:
                        missingFieldCount();
                }
                if (j < line.length - 1) {
                    // no trailing segment separator
                    this.separator();
                }
            }
            if (i < mappings.length - 1) {
                // skip trailing line separator
                this.newline();
            }
            this.column = 0;
        }
        return this.delegate.length;
    };
    MappingsEncoder.prototype.separator = function () {
        this.delegate.separator();
    };
    MappingsEncoder.prototype.newline = function () {
        this.delegate.newline();
    };
    MappingsEncoder.prototype.write5 = function (mapping) {
        this.delegate.write5(mapping.col - this.column, mapping.src - this.source, mapping.srcLine - this.sourceLine, mapping.srcCol - this.sourceColumn, mapping.name - this.name);
        this.column = mapping.col;
        this.source = mapping.src;
        this.sourceLine = mapping.srcLine;
        this.sourceColumn = mapping.srcCol;
        this.name = mapping.name;
    };
    MappingsEncoder.prototype.write4 = function (mapping) {
        this.delegate.write4(mapping.col - this.column, mapping.src - this.source, mapping.srcLine - this.sourceLine, mapping.srcCol - this.sourceColumn);
        this.column = mapping.col;
        this.source = mapping.src;
        this.sourceLine = mapping.srcLine;
        this.sourceColumn = mapping.srcCol;
    };
    MappingsEncoder.prototype.write1 = function (mapping) {
        this.delegate.write1(mapping.col - this.column);
        this.column = mapping.col;
    };
    return MappingsEncoder;
}());
function missingFieldCount() {
    throw new TypeError('mappings to encode require fieldCount');
}

var MappingsDecoder = /** @class */ (function () {
    function MappingsDecoder(delegate) {
        // absolutes
        this.line = 0;
        this.column = 0;
        this.source = 0;
        this.sourceLine = 0;
        this.sourceColumn = 0;
        this.name = 0;
        this.fieldCount = 0;
        this.delegate = delegate;
    }
    MappingsDecoder.prototype.decode = function (reader) {
        while (reader.hasNext()) {
            switch (reader.peek()) {
                case 59:// semicolon
                    if (this.fieldCount > 0) {
                        this.emitMapping();
                    }
                    this.emitNewline();
                    this.column = 0;
                    this.fieldCount = 0;
                    reader.next();
                    break;
                case 44:// comma
                    this.emitMapping();
                    this.fieldCount = 0;
                    reader.next();
                    break;
                default:
                    this.decodeField(reader);
                    break;
            }
        }
        if (this.fieldCount > 0) {
            this.emitMapping();
        }
    };
    MappingsDecoder.prototype.emitNewline = function () {
        this.delegate.newline();
    };
    MappingsDecoder.prototype.emitMapping = function () {
        switch (this.fieldCount) {
            case 1:
                this.delegate.mapping1(this.column);
                break;
            case 4:
                this.delegate.mapping4(this.column, this.source, this.sourceLine, this.sourceColumn);
                break;
            case 5:
                this.delegate.mapping5(this.column, this.source, this.sourceLine, this.sourceColumn, this.name);
                break;
        }
    };
    MappingsDecoder.prototype.decodeField = function (reader) {
        var value = decodeVLQ(reader) | 0;
        switch (this.fieldCount) {
            case 0:
                this.column += value;
                this.fieldCount = 1;
                break;
            case 1:
                this.source += value;
                this.fieldCount = 2;
                break;
            case 2:
                this.sourceLine += value;
                this.fieldCount = 3;
                break;
            case 3:
                this.sourceColumn += value;
                this.fieldCount = 4;
                break;
            case 4:
                this.name += value;
                this.fieldCount = 5;
                break;
        }
    };
    return MappingsDecoder;
}());

var Encoder = /** @class */ (function () {
    function Encoder(writer) {
        this.writer = writer;
    }
    Encoder.prototype.separator = function () {
        this.writer.write(44); /* , */
    };
    Encoder.prototype.newline = function () {
        this.writer.write(59); /* ; */
    };
    Encoder.prototype.write5 = function (column, source, sourceLine, sourceColumn, name) {
        encodeVLQ(this.writer, column);
        encodeVLQ(this.writer, source);
        encodeVLQ(this.writer, sourceLine);
        encodeVLQ(this.writer, sourceColumn);
        encodeVLQ(this.writer, name);
    };
    Encoder.prototype.write4 = function (column, source, sourceLine, sourceColumn) {
        encodeVLQ(this.writer, column);
        encodeVLQ(this.writer, source);
        encodeVLQ(this.writer, sourceLine);
        encodeVLQ(this.writer, sourceColumn);
    };
    Encoder.prototype.write1 = function (column) {
        encodeVLQ(this.writer, column);
    };
    Object.defineProperty(Encoder.prototype, "length", {
        get: function () {
            return this.writer.length;
        },
        enumerable: true,
        configurable: true
    });
    return Encoder;
}());

function createMapping1(col) {
    return {
        col: col,
        fieldCount: 1,
        name: 0,
        src: 0,
        srcCol: 0,
        srcLine: 0,
    };
}
function createMapping4(col, src, srcLine, srcCol) {
    return {
        col: col,
        fieldCount: 4,
        name: 0,
        src: src,
        srcCol: srcCol,
        srcLine: srcLine,
    };
}
function createMapping5(col, src, srcLine, srcCol, name) {
    return {
        col: col,
        fieldCount: 5,
        name: name,
        src: src,
        srcCol: srcCol,
        srcLine: srcLine,
    };
}

var Decoder = /** @class */ (function () {
    function Decoder() {
        this.currentLine = [];
        this.mappings = [this.currentLine];
    }
    Decoder.prototype.newline = function () {
        this.currentLine = [];
        this.mappings.push(this.currentLine);
    };
    Decoder.prototype.mapping1 = function (col) {
        this.currentLine.push(createMapping1(col));
    };
    Decoder.prototype.mapping4 = function (col, src, srcLine, srcCol) {
        this.currentLine.push(createMapping4(col, src, srcLine, srcCol));
    };
    Decoder.prototype.mapping5 = function (col, src, srcLine, srcCol, name) {
        this.currentLine.push(createMapping5(col, src, srcLine, srcCol, name));
    };
    return Decoder;
}());

/**
 * A function that concatenates source maps.
 *
 * Source maps are expected to be in the following format:
 *
 * ```js
 *   {
 *     version: <source-map version>,
 *     sources: [],
 *     sourcesContent: [],
 *     names: [],
 *     mappings: [
 *       [{
 *         col: <position in output line>,
 *         src: <position in sources array>,
 *         srcLine: <line within source>,
 *         srcCol: <column within source line>,
 *       }]
 *     ],
 *     file:
 *   }
 * ```
 */
function concat(maps) {
    var sources = maps.reduce(function (acc, map) {
        return acc.concat(map.sources);
    }, []);
    var sourcesContent = maps.reduce(function (acc, map) {
        return acc.concat(map.sourcesContent);
    }, []);
    var names = maps.reduce(function (acc, map) {
        return acc.concat(map.names);
    }, []);
    var srcOffset = 0;
    var nameOffset = 0;
    var mappings = maps.reduce(function (acc, map) {
        acc = acc.concat(map.mappings.map(function (lineMappings) {
            return lineMappings.map(function (mapping) { return ({
                col: mapping.col,
                fieldCount: mapping.fieldCount,
                name: mapping.name + nameOffset,
                src: mapping.src + srcOffset,
                srcCol: mapping.srcCol,
                srcLine: mapping.srcLine,
            }); });
        }));
        srcOffset += map.sources.length;
        nameOffset += map.names.length;
        return acc;
    }, []);
    return {
        file: '',
        mappings: mappings,
        names: names,
        sources: sources,
        sourcesContent: sourcesContent,
        version: '3',
    };
}

var fs = (function () {
    if (typeof module === 'object' &&
        typeof module.exports === 'object' &&
        typeof require === 'function') {
        return require('fs');
    }
})();
var readFile = fs === undefined ? function () { throw new Error('readFile not supported'); } :
    function (path) { return fs.readFileSync(path, { encoding: 'utf8' }); };

function toBuffer(str) {
    var buffer = new Uint8Array(str.length);
    for (var i = 0; i < buffer.length; i++) {
        // this is for base64 so we know these are all < 123
        buffer[i] = str.charCodeAt(i) | 0;
    }
    return buffer;
}

function decode(map) {
    var buffer = toBuffer(map.mappings);
    var reader = new IntBufferReader(buffer, 0, buffer.length);
    var decoder = new Decoder();
    var mappingsDecoder = new MappingsDecoder(decoder);
    mappingsDecoder.decode(reader);
    map.mappings = decoder.mappings;
    return map;
}
function decodeFile(path) {
    return decode(JSON.parse(readFile(path)));
}

function toString(buffer, offset, len) {
    var str = '';
    for (var i = offset; i < len; i++) {
        str += String.fromCharCode(buffer[i]);
    }
    return str;
}

function encode(map) {
    var buffer = [];
    var writer = new IntBufferWriter(buffer, 0);
    var encoder = new Encoder(writer);
    var mappingsEncoder = new MappingsEncoder(encoder);
    mappingsEncoder.encode(map.mappings);
    map.mappings = toString(buffer, 0, buffer.length);
    return map;
}
/**
 * Takes a source map file with a decoded `mappings` section and reencodes
 * `mappings`.
 */
function encodeFile(path) {
    var map = JSON.parse(readFile(path));
    return encode(map);
}

exports.encodeVLQ = encodeVLQ;
exports.decodeVLQ = decodeVLQ;
exports.IntBufferReader = IntBufferReader;
exports.IntBufferWriter = IntBufferWriter;
exports.MappingsEncoder = MappingsEncoder;
exports.MappingsDecoder = MappingsDecoder;
exports.Encoder = Encoder;
exports.Decoder = Decoder;
exports.concat = concat;
exports.decode = decode;
exports.decodeFile = decodeFile;
exports.encode = encode;
exports.encodeFile = encodeFile;

return exports;

}({}));
//# sourceMappingURL=browser.js.map
