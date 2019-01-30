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
  /**
   * curl -s localhost:60702/api/bundle/$BUNDLE_ID | jq '.'
   */
  app.get("/api/bundle/:id", async (req, res) => {
    const options = {
      url: `${url}/${req.params.id}`,
      json: true
    };
    try {
      const esResBody = await rp(options);
      res.status(200).json(esResBody);
    } catch (error) {
      res.status(error.statusCode || 502).json(error.error);
    }
  });
  /**
   * curl -s -X PUT localhost:60702/api/bundle/$BUNDLE_ID/name/foo | jq '.'
   */
  app.put("/api/bundle/:id/name/:name", async (req, res) => {
    const bundleUrl = `${url}/${req.params.id}`;
    // console.log(bundleUrl);
    try {
      const bundle = (await rp({ url: bundleUrl, json: true }))._source;
      // console.log(bundle);
      bundle.name = req.params.name;
      const esResBody = await rp.put({
        url: bundleUrl,
        json: true,
        body: bundle
      });
      res.status(200).json(esResBody);
    } catch (error) {
      res.status(error.statusCode || 502).json(error.error);
    }
  });
  /**
   * curl -s -X PUT localhost:60702/api/bundle/$BUNDLE_ID/book/pg132 | jq '.'
   */
  app.put("/api/bundle/:id/book/:pgid", async (req, res) => {
    const bundleUrl = `${url}/${req.params.id}`;
    const bookUrl = `http://${es.host}:${es.prot}/${es.books_index}/book/${
      req.params.pgid
    }`;
    try {
      const [bundleRes, bookRes] = await Promise.all([
        rp({ url: bundleUrl, json: true }),
        rp({ url: bookUrl, json: true })
      ]);
      const { _source: bundle, _version: version } = bundleRes;
      const { _source: book } = bookRes;
      // console.log(bundle.books, req.params.pgid);
      const idx = bundle.books.findIndex(book => book.id === req.params.pgid);
      // console.log(idx);
      if (idx === -1) {
        bundle.books.push({
          id: req.params.pgid,
          title: book.title
        });
      }
      const esResBody = await rp.put({
        url: bundleUrl,
        qs: { version },
        body: bundle,
        json: true
      });
      res.status(200).json(esResBody);
    } catch (error) {
      res.status(error.statusCode || 502).json(error.error);
    }
  });
  /**
   * curl -s -X DELETE localhost:60702/api/bundle/$BUNDLE_ID | jq '.'
   */
  app.delete("/api/bundle/:id", async (req, res) => {
    const bundleUrl = `${url}/${req.params.id}`;
    try {
      const delBundle = await rp.delete({ url: bundleUrl, json: true });
      res.status(200).json(delBundle);
    } catch (error) {
      res.status(error.statusCode || 502).json(error.error);
    }
  });

  app.delete("/api/bundle/:id/book/:pgid", async (req, res) => {
    const bundleUrl = `${url}/${req.params.id}`;
    try {
      const bundleRes = await rp({ url: bundleUrl, json: true });
      const { _source: bundle, _version: version } = bundleRes;
      const idx = bundle.books.findIndex(book => book.id === req.params.pgid);
      if (idx === -1) {
        throw {
          statusCode: 409,
          error: {
            reason: "没有找到这本书"
          }
        };
      }
      bundle.books.splice(idx, 1);
      const esResBody = await rp.put({
        url: bundleUrl,
        qs: { version },
        body: bundle,
        json: true
      });
      res.status(200).json(esResBody);
    } catch (error) {
      res.status(error.statusCode || 502).json(error.error);
    }
  });
};
