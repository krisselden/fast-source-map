'use strict';

var index = require('../../dist/index');

var concat = require('concat-stream');
var length = process.argv.length;
if (length === 3) {
    console.log(JSON.stringify(index.encodeFile(process.argv[2])));
}
else if (length === 2) {
    process.stdin.pipe(concat(function (data) {
        console.log(JSON.stringify(index.encode(JSON.parse(data))));
    }));
}
else {
    console.error('USAGE: decode FILE');
    process.exit(1);
}
//# sourceMappingURL=encode-source-map.js.map
