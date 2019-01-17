"use strict";
const request = require("request");
const rp = require('request-promise')
module.exports = (app, es) => {
  const url = `http://${es.host}:${es.prot}/${es.books_index}/book/_search`;
  app.get("/api/search/books/:field/:query", (req, res) => {
    // req.params是动态路由的值,上面这个的req.params是{ field: 'authors', query: 'Shakespeare' }
    // req.query是路由传参的值 http://www.baidu.com?id=id&user=我是你爸爸 的req.query = {id: 'id', user: '我是你爸爸'}
    // req的API http://expressjs.com/zh-cn/api.html#req
    // 关于res的API 参照 http://expressjs.com/zh-cn/api.html#res.status
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
      // console.log(esResBody.hits.hits);
      res.status(200).json(esResBody.hits.hits.map(({ _source }) => _source));
    });
  });
  app.get("/api/suggest/:field/:query", (req, res) => {
    const esReqBody = {
      size: 0,
      suggest: {
        suggestions: {
          text: req.params.query,
          term: {
            field: req.params.field,
            suggest_mode: "always"
          }
        }
      }
    };
    const options = { url, json: true, body: esReqBody };
    // const promise = new Promise((resolve, reject) => {
    //   request.get(options, (err, esRes, esResBody) => {
    //     if (err) {
    //       reject({ error: err });
    //       return;
    //     }
    //     if (esRes.statusCode !== 200) {
    //       reject({ error: esResBody });
    //       return;
    //     }
    //     resolve(esReqBody);
    //   });
    // });
    // promise
    //   .then(esResBody => {
    //     // console.log(esResBody);
    //     res.status(200).json(esResBody.suggest.suggestions);
    //   })
    //   .catch(({ error }) => {
    //     res.status(error.status || 502).json(error);
    //   });
    rp.get(options)
      .then(esResBody => {
        // console.log(esResBody);
        res.status(200).json(esResBody.suggest.suggestions);
      })
      .catch(({ error }) => {
        res.status(error.status || 502).json(error);
      });
  });
};
