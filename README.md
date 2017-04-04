# proxy

[![Codeship badge](https://codeship.com/projects/fc008360-f90f-0134-9e36-76184fa5b855/status?branch=master)](https://app.codeship.com/projects/132772)
[![Code Climate](https://codeclimate.com/github/neotoma/proxy/badges/gpa.svg)](https://codeclimate.com/github/neotoma/proxy)
[![Code Climate issues badge](https://codeclimate.com/github/neotoma/proxy/badges/issue_count.svg)](https://codeclimate.com/github/neotoma/proxy/issues)
[![David badge](https://david-dm.org/neotoma/proxy.svg)](https://david-dm.org/neotoma/proxy)

This repository contains the source code for a server that acts as a proxy for any number of other servers ("targets") running on the same host but different ports.

It allows for access to those targets from the same port (e.g. browser default `80`) but different domains (e.g. `example.com`, `api.example.com`, `example.org`).

## Setup

Configuration files and SSL certificates are managed by [Park Ranger](https://github.com/markmhx/park-ranger) with the following configuration schema:

#### Config (object)
- ports
    - http (number) - Port on which proxy should listen for HTTP requests
    - https (number) - Port on which proxy should listen for HTTPS requests
- targets (array[Target])

#### Target (object)
- host (string, required) - Hostname for which proxy should listen for requests
- http (string) - Hostname to which proxy should route HTTP requests
- https (string) - Hostname to which proxy should route HTTPS requests

-----------

### Example:

```
{
  "ports": {
    "http": 80,
    "https": 443
  },
  "targets": [{
    "host": "example.com",
    "http": "example.com:1234",
    "https": "example.com:5678"
  }, {
    "host": "example.org",
    "https": "example.com:1234",
    "https": "example.com:5678"
  }, {
    "host": "api.example.com",
    "https": "example.com:9876"
  }]
}
```

## Scripts

Deployment scripts are available through [Hoist](https://github.com/markmhx/grunt-hoist). The following are also supported:

- `npm run dev`: Runs the proxy and automatically reloads it when code changes are made during development