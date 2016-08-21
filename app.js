var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxy();

var router = {};
router[process.env.PROXY_WEB_EXTERNAL] = process.env.PROXY_WEB_INTERNAL;
router[process.env.PROXY_SERVER_EXTERNAL] = process.env.PROXY_SERVER_INTERNAL;

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

console.log('Proxying...');