This repository contains the source code for a web server that acts as a proxy for instances of [personal-server](https://github.com/asheville/personal-server) and [personal-web](https://github.com/asheville/personal-web) running on the same host but different ports. 

It allows for access to both servers from the same port (e.g. browser default `80`) but different subdomains (e.g. root and `api.`). The proxy defaults to routing `personal-web` if the subdomain is unrecognized.

The following environment variables are required:

- `PROXY_PORT`: Port through which to serve this proxy on host (e.g. `80`)
- `PROXY_WEB_EXTERNAL`: Subdomain through which to serve `personal-web` (e.g. `example.com`)
- `PROXY_WEB_INTERNAL`: Root domain with port used by `personal-web` on host (e.g. `example.com:4200`)
- `PROXY_SERVER_EXTERNAL`: Subdomain through which to serve `personal-server` (e.g. `api.example.com`)
- `PROXY_SERVER_INTERNAL`: Root domain with port used by `personal-server` on host (e.g. `example.com:4201`)

A live example of this proxy server can be found at [markmhendrickson.com](http://markmhendrickson.com). The `personal-web` server can be accessed via either [markmhendrickson.com](http://markmhendrickson.com) or [markmhendrickson.com:4200](http://markmhendrickson.com:4200), and the `personal-server` server can be accessed via either [api.markmhendrickson.com/attributes](http://api.markmhendrickson.com/attributes) or [markmhendrickson.com:4201/attributes](http://markmhendrickson.com:4201/attributes)