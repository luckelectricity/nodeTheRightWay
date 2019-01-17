"use strict";
const request = require("request");

module.exports = (app, es) => {
  const url = `http://${es.host}:${es.prot}/${es.books_index}/book/_search`;
  app.get("/api/search/books/:field/:query", (req, res) => {
    const esReqBody = {
      size: 10,
      query: {
        match: {
          [req.params.field]: req.params.query
        }
      }
    };
    const options = { url, json: true, body: esReqBody };
    request.get(options, (err, esRes, esResBody) => {
      if (err) {
        res.status(502).json({
          error: "bad_gateway",
          reason: err.code
        });
        return;
      }
      if (esRes.statusCode !== 200) {
        res.status(esRes.statusCode).json(esResBody);
        return;
      }
      console.log(esResBody.hits);
      res.status(200).json(esResBody.hits.hits.map(({ _source }) => _source));
    });
  });
};
