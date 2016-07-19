const fs: FS | undefined = (() => {
  if (typeof module === "object" &&
    typeof module.exports === "object" &&
    typeof require === "function") {
    return require("fs");
  }
})();

const readFile: {
  (path: string): string;
} = fs === undefined ? () => { throw new Error("readFile not supported"); } :
                       path => fs.readFileSync(path, { encoding: "utf8" });

interface FS {
  readFileSync(path: string, options: { encoding: string });
}

export default readFile;
