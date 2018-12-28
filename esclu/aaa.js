const request = require("request");
const program = require("commander");
const options = {
  url: "http://localhost:9200/",
  json: ""
};
// request(options, (err, res, body) => {
//   console.log(body);
// });
function aaa() {
  console.log(121212);
}
program
  .command("get")
  .description("this is http request for path(default is /)")
  .action(() => {
    // request(options, (err, res, body) => {
    //   console.log(body);
    // });
    aaa()
    console.log(aaa);
  });
