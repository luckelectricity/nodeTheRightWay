"use strict";

const rp = require("request-promise");

module.exports = (app, es) => {
  /**
   * curl -s -X POST localhost:60702/api/bundle?name=light%20reading | jq '.'
   */
  const url = `http://${es.host}:${es.prot}/${es.bundles_index}/bundles`;
  app.post("/api/bundle", (req, res) => {
    const bundle = {
      name: req.query.name || "",
      books: []
    };
    rp.post({ url, body: bundle, json: true })
      .then(esResBody => {
        res.status(201).json(esResBody);
      })
      .catch(({ error }) => {
        res.status(error.status || 502).json(error);
      });
  });
};
