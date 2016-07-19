import { encode, encodeFile } from "../index";

const concat = require("concat-stream");
let length = process.argv.length;

if (length === 3) {
  console.log(JSON.stringify(encodeFile(process.argv[2])));
}
else if (length === 2) {
  process.stdin.pipe(concat(function(data) {
    console.log(JSON.stringify(encode(JSON.parse(data))));
  }));
}
else {
  console.error("USAGE: decode FILE");
  process.exit(1);
}
