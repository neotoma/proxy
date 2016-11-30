require('./dotenv');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxy();
var fs = require('fs');

// HTTP

if (process.env.PROXY_EXTERNAL_HTTP_PORT) {
  if (!process.env.PROXY_WEB_HTTP_INTERNAL_HOST && !process.env.PROXY_SERVER_HTTP_INTERNAL_HOST) {
    throw new Error('App failed to find an internal web or server HTTP host from the environment');
  }

  var httpRouter = {};
  var defaultHttpTarget;

  if (process.env.PROXY_SERVER_HTTP_INTERNAL_HOST) {
    var host = 'http://' + process.env.PROXY_SERVER_HTTP_INTERNAL_HOST;
    httpRouter[process.env.PROXY_SERVER_EXTERNAL_HOST] = host;
    defaultHttpTarget = 'http://' + process.env.PROXY_SERVER_HTTP_INTERNAL_HOST;
  }

  if (process.env.PROXY_WEB_HTTP_INTERNAL_HOST) {
    var host = 'http://' + process.env.PROXY_WEB_HTTP_INTERNAL_HOST
    httpRouter[process.env.PROXY_WEB_EXTERNAL_HOST] = host;
    defaultHttpTarget = host;
  }

  require('http').createServer(function(req, res) {
    var target = defaultHttpTarget;

    if (typeof httpRouter[req.headers.host] !== 'undefined') {
      target = httpRouter[req.headers.host];
    }

    proxy.web(req, res, {
      target: target
    }, function(error) {
      res.writeHead(500);
      res.write('Internal Server Error');
      res.end();
      console.error(error);
    });
  }).listen(process.env.PROXY_EXTERNAL_HTTP_PORT);

  console.log('Listening for HTTP requests on port', process.env.PROXY_EXTERNAL_HTTP_PORT);
  console.log('Proxying HTTP router', httpRouter);
}

// HTTPS

if (process.env.PROXY_EXTERNAL_HTTPS_PORT) {
  if (!process.env.PROXY_WEB_HTTPS_INTERNAL_HOST && !process.env.PROXY_SERVER_HTTPS_INTERNAL_HOST) {
    throw new Error('App failed to find an internal web or server HTTPS host from the environment');
  }

  var httpsRouter = {};
  var defaultHttpsTarget;

  if (process.env.PROXY_SERVER_HTTPS_INTERNAL_HOST) {
    var host = 'https://' + process.env.PROXY_SERVER_HTTPS_INTERNAL_HOST;
    httpsRouter[process.env.PROXY_SERVER_EXTERNAL_HOST] = host;
    defaultHttpsTarget = host;
  }

  if (process.env.PROXY_WEB_HTTPS_INTERNAL_HOST) {
    var host = 'https://' + process.env.PROXY_WEB_HTTPS_INTERNAL_HOST;
    httpsRouter[process.env.PROXY_WEB_EXTERNAL_HOST] = host;
    defaultHttpsTarget = host;
  }

  var keyPath = process.env.PROXY_CERTS_DIR + '/key';
  var certPath = process.env.PROXY_CERTS_DIR + '/crt';
  var caPath = process.env.PROXY_CERTS_DIR + '/ca';

  if (!fs.existsSync(keyPath)) {
    throw new Error('App failed to find a SSL key file');
  }

  if (!fs.existsSync(certPath)) {
    throw new Error('App failed to find a SSL certificate file');
  }

  if (!fs.existsSync(caPath)) {
    throw new Error('App failed to find a SSL intermediate CA certificate file');
  }

  require('https').createServer({
    key: fs.readFileSync(keyPath, 'utf8'),
    cert: fs.readFileSync(certPath, 'utf8'),
    ca: fs.readFileSync(caPath, 'utf8')
  }, function(req, res) {
    var target = defaultHttpsTarget;

    if (typeof httpsRouter[req.headers.host] !== 'undefined') {
      target = httpsRouter[req.headers.host];
    }

    proxy.web(req, res, {
      target: target,
      secure: true,
      ssl: {
        key: fs.readFileSync(keyPath, 'utf8'),
        cert: fs.readFileSync(certPath, 'utf8'),
        ca: fs.readFileSync(caPath, 'utf8')
      }
    }, function(error) {
      res.writeHead(500);
      res.write('Internal Server Error');
      res.end();
      console.error(error);
    });
  }).listen(process.env.PROXY_EXTERNAL_HTTPS_PORT);

  console.log('Listening for HTTPS requests on port', process.env.PROXY_EXTERNAL_HTTPS_PORT);
  console.log('Proxying HTTPS router', httpsRouter);
}