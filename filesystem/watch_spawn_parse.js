const fs = require("fs");

const spawn = require("child_process").spawn;

const fileName = process.argv[2];

if (!fileName) {
  throw Error("文件不存在");
}

fs.watch(fileName, () => {
  const ls = spawn("ls", ["-l", "-h", fileName]);
  let output = "";
  ls.stdout.on("data", data => output += data);
  ls.on("close", () => {
    const parts = output.split(/\s+/);
    console.log([parts[0], parts[4], parts[8]]);
  });
});
console.log(`文件${fileName}修改`);
