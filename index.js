/**
 * Proxy server for HTTP and HTTPS requests
 * @module
 */

var debug = require('debug')('proxy'),
    fs = require('fs'),
    httpProxy = require('http-proxy'),
    proxy = httpProxy.createProxy(),
    ranger = require('park-ranger')(),
    cert = ranger.cert,
    config = ranger.config;

debug('establishing proxy: %O', config);

['http', 'https'].forEach((protocol) => {
  if (!config.ports[protocol]) { return; }
    
  var httpRouter = {};

  var createServer = (protocol, done) => {
    if (protocol === 'https') {
      return require(protocol).createServer(cert, done);
    } else {
      return require(protocol).createServer(done);
    }
  };

  createServer(protocol, function(req, res) {
    var target;

    config.targets.forEach((configTarget) => {
      if (configTarget.host === req.headers.host && configTarget[protocol]) {
        target = configTarget[protocol];
      }
    });

    if (!target) {
      res.writeHead(404);
      res.write('Not Found');
      res.end();
      return;
    }

    debug('proxying %s request for host %s to target %s', protocol, req.headers.host, target);

    proxy.web(req, res, {
      secure: protocol === 'https' ? true : false,
      ssl: cert,
      target: protocol + '://' + target
    }, function(error) {
      res.writeHead(500);
      res.write('Internal Server Error');
      res.end();

      debug(error.message);
    });
  }).listen(config.ports[protocol], () => {
    debug('listening for HTTP requests on port %s', config.ports[protocol]);
  });
});