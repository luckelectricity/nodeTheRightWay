"use strict";
const fs = require("fs");
const program = require("commander");
const request = require("request");
const pkg = require("./package.json");
// const async = require('async')
const fullUrl = (path = "") => {
  let url = `http://${program.host}:${program.port}/`;
  if (program.index) {
    url += program.index + "/";
    if (program.type) {
      url += program.type + "/";
    }
  }
  return url + path.replace(/^\/*/, "");
};

const handleResponse = (err, res, body) => {
  if (program.json) {
    console.log(JSON.stringify(err || body));
  } else {
    if (err) throw err;
    console.log(body);
  }
};

program
  .version(pkg.version)
  .description(pkg.description)
  .usage("[options]<command>[...]")
  .option("-o, --host <hostname>", "主机名 [localhost]", "localhost")
  .option("-p, --port <number>", "端口号 [9200]", "9200")
  .option("-j, --json", "格式输出为JSON")
  .option("-i, --index <name>", "使用的索引")
  .option("-t, --type <type>", "批量操作的默认类型")
  .option("-f, --fillter <fillter>", "查询结果过滤");

program
  .command("url [path]")
  .description("生成选项和路径的URL(default is /)")
  .action((path = "/") => {
    console.log(fullUrl(path));
  });

program
  .command("get [path]")
  .description("http请求的路径(default is /)")
  .action((path = "/") => {
    const options = {
      url: fullUrl(path),
      json: program.json
    };
    request(options, handleResponse);
  });

program
  .command("create-index")
  .description("创建一个索引")
  .action(() => {
    if (!program.index) {
      const msg = "No index specified! Use --index <name>";
      if (!program.json) throw Error(msg);
      console.log(JSON.stringify({ error: msg }));
      return;
    }
    request.put(fullUrl(), handleResponse);
  });

program
  .command("list-indices")
  .alias("li")
  .description("获取此群集中的索引列表")
  .action(() => {
    const path = program.json ? "_all" : "_cat/indices?v";
    request({ url: fullUrl(path), json: program.json }, handleResponse);
  });

program
  .command("bulk <file>")
  .description("从指定的文件执行批量选项")
  .action(file => {
    fs.stat(file, (err, stats) => {
      if (err) {
        if (program.json) {
          console.log(JSON.stringify(err));
          return;
        }
        throw err;
      }
      const options = {
        url: fullUrl("_bulk"),
        json: true,
        headers: {
          "contenr-length": stats.size,
          "content-type": "application/json"
        }
      };
      const req = request.post(options);

      const stream = fs.createReadStream(file);

      stream.pipe(req);
      req.pipe(process.stdout);
    });
  });

program
  .command("query [queries...]")
  .alias("q")
  .description("执行elasticsearch查询")
  .action((queries = []) => {
    const options = {
      url: fullUrl('_search'),
      json: program.json,
      qs: {}
    }
    if(queries && queries.length){
      options.qs.q = queries.json(' ')
    }
    if(program.fillter){
      options.qs._source = program.fillter
    }
    request(options, handleResponse)
  })

program.parse(process.argv);

if (!program.args.filter(arg => typeof arg === "object").length) {
  program.help();
}
