const oauthServer = require('oauth2-server');
const express = require('express');
const Request = oauthServer.Request;
const Response = oauthServer.Response;
const oauth = require('./oauth');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/oauth/token').all((req, res, next) => {
  const request = new Request(req);
  const response = new Response(res);

  oauth
    .token(request, response)
    .then(token =>
      // Todo: remove unnecessary values in response
      res.json(token)
    )
    .catch(err => res.status(500).json(err));
});

module.exports = router;
