# Proxy

This repository contains the source code for a server that acts as a proxy for instances of two other servers (namely, one for a web client and one for an API) running on the same host but different ports.

It allows for access to both servers from the same port (e.g. browser default `80`) but different subdomains (e.g. root and `api.`). The proxy defaults to routing the web server if the subdomain is unrecognized.

## Setting up the environment

The code requires several variables to run the server locally as well as deploy it to another system. The following environment variables can be declared by adding a file named `.env` (in [INI format](https://en.wikipedia.org/wiki/INI_file)) to the base directory, assuming they're not declared elsewhere in the system already. Such a file will be ignored by Git.

- `PROXY_EXTERNAL_HTTP_PORT`: Port through which to serve HTTP requests with this proxy on host (e.g. `80`)
- `PROXY_EXTERNAL_HTTPS_PORT`: Port through which to serve HTTPs requests with this proxy on host (e.g. `443`)
- `PROXY_WEB_EXTERNAL_HOST`: Subdomain through which to serve the web client with port as needed (e.g. `example.com`)
- `PROXY_WEB_HTTP_INTERNAL_HOST`: Root domain with port used by the web server on host (e.g. `example.com:4200`)
- `PROXY_WEB_HTTPS_INTERNAL_HOST`: Root domain with port used by the web server on host (e.g. `example.com:4201`)
- `PROXY_SERVER_EXTERNAL_HOST`: Subdomain through which to serve the API (e.g. `api.example.com`)
- `PROXY_SERVER_HTTP_INTERNAL_HOST`: Root domain with port used by the API server on host (e.g. `example.com:4202`)
- `PROXY_SERVER_HTTPS_INTERNAL_HOST`: Root domain with port used by the API server on host (e.g. `example.com:4203`)
- `PROXY_CERTS_DIR`: Local system path to a directory with the SSL certificate files `key`, `crt` and `ca` needed by the app to serve HTTPs requests (e.g. `.certs`; required to run app with HTTPs support)
- `PROXY_DEPLOY_HOST_USERNAME`: User name with which to SSH into remote deployment server (e.g. `root`; required to deploy app)
- `PROXY_DEPLOY_HOST`: Host address for the remote deployment server (e.g. `example.com`; required to deploy app)
- `PROXY_DEPLOY_HOST_DIR`: Remote system path to app directory on deployment server (e.g. `/var/www/proxy`; required to deploy app)
- `PROXY_DEPLOY_CERTS_DIR`: Local system path to a directory with the SSL certificate files `key`, `crt` and `ca` needed by the app to serve HTTPs requests *remotely on the deployment server* (e.g. `.certs-deploy`; required to deploy app with HTTPs support). This directory will be copied to `.certs` within the base directory of the app on the deployment server so the environment variable `PROXY_CERTS_DIR` must be set to `.certs` in the deployment environment unless this directory is later moved.

Note that you can create a directory called `.certs-deploy` within the base directory to satisfy the `PROXY_CERTS_DIR` variable and it will be ignored by Git.

If you intend to deploy the server to another system using scripts within the "Developing and deploying the server" section below, you can also create a `.env-deploy` file in the base directory, one that will be ignored by Git and used upon deployment to create an `.env` file remotely, thereby setting environment variables on the deployment server.

If you want to develop or deploy multiple environments using the same repository, you can add environment and cert files to the base directory that contain a suffix identifier. For example, you can add support for an environment called "foo" by adding `.env-foo` and `.env-foo-deploy` files and a `.certs-foo` directory. These files and directory would also be ignored by Git.

By setting `PROXY_ENV` to `foo` in the environment when running the app or any scripts per below, those files will be used instead of the default environment and certificate files to populate runtime variables. For example, you could then execute `PROXY_ENV=foo node app.js` to start the app in the "foo" environment.

## Developing and deploying the server

With [Grunt](gruntjs.com) installed in addition to establishing your environment accordingly per the instructions above, you can run any of the following scripts to help with development and deployment:

- `grunt dev`: Runs the app and automatically reloads it when code changes are made during development
- `grunt deploy`: Deploys environment and certificate file dependencies, deploys the app remotely, runs `npm install` remotely to ensure the installation of dependencies, and either starts or restarts the app remotely with [forever](https://github.com/foreverjs/forever). Ensure that Node with NPM and forever are installed remotely before running this script.
- `grunt deploy-dependencies`: Deploys environment and certificate file dependencies.
- `grunt deploy-app`: Deploys the app remotely, runs `npm install` remotely to ensure the installation of dependencies, and either starts or restarts the app remotely with forever.

## Example usage

A live example of this proxy server can be found at [markmhendrickson.com](http://markmhendrickson.com). The web server can be accessed via either [markmhendrickson.com](http://markmhendrickson.com) or [markmhendrickson.com:4200](http://markmhendrickson.com:4200), and the API server can be accessed via either [api.markmhendrickson.com/attributes](http://api.markmhendrickson.com/attributes) or [markmhendrickson.com:4201/attributes](http://markmhendrickson.com:4201/attributes)