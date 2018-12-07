const fs = require("fs");

const spawn = require("child_process").spawn;

const fileName = process.argv[2];

if (!fileName) {
  throw Error("文件不存在");
}

fs.watch(fileName, () => {
  const ls = spawn("ls", ["-l", "-h", fileName]);
  ls.stdout.pipe(process.stdout);
});
console.log(`文件${fileName}修改`);
