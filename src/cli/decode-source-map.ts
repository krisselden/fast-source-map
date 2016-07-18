import { decode, decodeFile } from "../decode";

const concat = require("concat-stream");
let length = process.argv.length;

if (length === 3) {
  console.log(JSON.stringify(decodeFile(process.argv[2])));
}
else if (length === 2) {
  process.stdin.pipe(concat(function(data) {
    console.log(JSON.stringify(decode(JSON.parse(data))));
  }));
}
else {
  console.error("USAGE: decode FILE");
  process.exit(1);
}
