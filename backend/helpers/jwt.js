const expressJwt = require('express-jwt');
const { pathToRegexp } = require('path-to-regexp');

function authJwt() {
  const secret = process.env.SECRET;
  const api = process.env.API_URL;

  const publicProductsUrl = pathToRegexp(`${api}/products(.*)`);
  const publicCategoriesUrl = pathToRegexp(`${api}/categories(.*)`);

  return expressJwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: isRevokedCallback,
  }).unless({
    path: [
      { url: publicProductsUrl, methods: ['GET', 'OPTIONS'] },
      { url: publicCategoriesUrl, methods: ['GET', 'OPTIONS'] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}

async function isRevokedCallback(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true); // reject the token
  }
  done();
}

module.exports = authJwt;
