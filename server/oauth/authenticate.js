const oauthServer = require('oauth2-server');
const Request = oauthServer.Request;
const Response = oauthServer.Response;
const db = require('./mongodb');
const oauth = require('./oauth');

module.exports = function (options) {
  var options = options || {};
  return function (req, res, next) {
    const request = new Request({
      headers: { authorization: req.headers.authorization },
      method: req.method,
      query: req.query,
      body: req.body
    });
    const response = new Response(res);

    oauth
      .authenticate(request, response, options)
      .then((token) => {
        // Request is authorized.
        req.user = token;
        next();
      })
      .catch((err) => {
        // Request is not authorized.
        res.status(err.code || 500).json(err);
      });
  };
};
