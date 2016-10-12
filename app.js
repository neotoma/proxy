var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxy();
var fs = require('fs');

var router = {};
router[process.env.PROXY_WEB_EXTERNAL] = 'http://' + process.env.PROXY_WEB_INTERNAL;
router[process.env.PROXY_SERVER_EXTERNAL] = 'http://' + process.env.PROXY_SERVER_INTERNAL;
router[process.env.PROXY_WEB_EXTERNAL] = 'https://' + process.env.PROXY_WEB_INTERNAL;
router[process.env.PROXY_SERVER_EXTERNAL] = 'https://' + process.env.PROXY_SERVER_INTERNAL;

require('http').createServer(function(req, res) {
  var target = process.env.PROXY_WEB_INTERNAL;

  if (typeof router[req.headers.host] !== 'undefined') {
    target = router[req.headers.host];
  }

  proxy.web(req, res, {
    target: target
  }, function(error) {
    res.writeHead(500);
    res.write('Internal Server Error');
    res.end();
  });
}).listen(process.env.PROXY_PORT);

console.log('Listening on port', process.env.PROXY_PORT);

require('https').createServer({
  key: fs.readFileSync(process.env.PROXY_SSL_KEY, 'utf8'),
  cert: fs.readFileSync(process.env.PROXY_SSL_CRT, 'utf8'),
  ca: fs.readFileSync(process.env.PROXY_SSL_INT_CRT, 'utf8')
}, function(req, res) {
  var target = process.env.PROXY_WEB_INTERNAL;

  if (typeof router[req.headers.host] !== 'undefined') {
    target = router[req.headers.host];
  }

  proxy.web(req, res, {
    target: target,
    secure: true,
    ssl: {
      key: fs.readFileSync(process.env.PROXY_SSL_KEY, 'utf8'),
      cert: fs.readFileSync(process.env.PROXY_SSL_CRT, 'utf8'),
      ca: fs.readFileSync(process.env.PROXY_SSL_INT_CRT, 'utf8')
    }
  }, function(error) {
    res.writeHead(500);
    res.write('Internal Server Error');
    res.end();
  });
}).listen(process.env.PROXY_SECURE_PORT);

console.log('Listening on secure port', process.env.PROXY_SECURE_PORT);

console.log('Proxying router', router);