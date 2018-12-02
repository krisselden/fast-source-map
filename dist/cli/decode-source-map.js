'use strict';

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

var concat = require('concat-stream');
var length = process.argv.length;
if (length === 3) {
    console.log(JSON.stringify(decodeFile(process.argv[2])));
}
else if (length === 2) {
    process.stdin.pipe(concat(function (data) {
        console.log(JSON.stringify(decode(JSON.parse(data))));
    }));
}
else {
    console.error('USAGE: decode FILE');
    process.exit(1);
}
//# sourceMappingURL=decode-source-map.js.map
