This repository contains the source code for a server that acts as a proxy for instances of two other servers (namely, one for a web client and one for an API) running on the same host but different ports.

It allows for access to both servers from the same port (e.g. browser default `80`) but different subdomains (e.g. root and `api.`). The proxy defaults to routing the web server if the subdomain is unrecognized.

The following environment variables are required:

- `PROXY_PORT`: Port through which to serve this proxy on host (e.g. `80`)
- `PROXY_WEB_EXTERNAL`: Subdomain through which to serve the web client (e.g. `example.com`)
- `PROXY_WEB_INTERNAL`: Root domain with port used by the web server on host (e.g. `example.com:4200`)
- `PROXY_SERVER_EXTERNAL`: Subdomain through which to serve the API (e.g. `api.example.com`)
- `PROXY_SERVER_INTERNAL`: Root domain with port used by the API server on host (e.g. `example.com:4201`)

A live example of this proxy server can be found at [markmhendrickson.com](http://markmhendrickson.com). The web server can be accessed via either [markmhendrickson.com](http://markmhendrickson.com) or [markmhendrickson.com:4200](http://markmhendrickson.com:4200), and the API server can be accessed via either [api.markmhendrickson.com/attributes](http://api.markmhendrickson.com/attributes) or [markmhendrickson.com:4201/attributes](http://markmhendrickson.com:4201/attributes)