const request = require("request");
const options = {
  url: "http://localhost:9200/",
  json: ""
};
request(options, (err, res, body) => {
  console.log(body);
});
