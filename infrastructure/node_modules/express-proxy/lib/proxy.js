/**
 * Module dependencies
 */

var express = require('express'),
    path = require('path'),
    join = path.join,
    extname = path.extname,
    url = require('url'),
    parse = url.parse;

/**
 * Cached servers
 */

var servers = {};

/**
 * Initialize a `Proxy` server
 *
 * @param {string|options} options
 * @api public
 */

var Proxy = module.exports = function(options) {
  if(!(this instanceof Proxy)) return new Proxy(options);
  options = options || {};

  if(typeof options === 'string') this.root = options;

  this.root = this.root || options.root,
  this.home = options.home || 'index';

  if(!this.root) throw new Error('Root is required');

  // trim leading /
  this.home = this.home.replace(/^\//, '');

  var app = this.app = express();
  // app.use(express.favicon(this.favicon));

  app.all('*', this.router.bind(this));

  // Save a reference to the proxy object
  app.proxy = this;

  return app;
};

/**
 * Route all traffic through the router
 *
 * @param  {object}   req
 * @param  {object}   res
 * @param  {function} next
 * @api private
 */

Proxy.prototype.router = function(req, res, next) {
  var url = parse(req.url).pathname,
      path = this.resolve(url),
      serverPath = join(this.root, path.route),
      server = servers[serverPath];

  // Rewrite the url
  req.url = path.path;

  if(server) return server(req, res, next);

  try {
    server = servers[serverPath] = require(serverPath);
  } catch(err) {
    return next(err);
  }

  return server(req, res, next);
};

/**
 * Resolve the server route and path
 *
 * @param  {string} path
 * @api private
 *
 * @return {object} returns `route`, which is the route to the server
 * and `path` which is the path on that server
 */

Proxy.prototype.resolve = function(path) {
  // Pull the proxy route from the server path
  var parts = path.replace(/^\//, '').split('/'),
      route = parts.shift();

  // Exception: /index.css
  if(!parts.length && extname(route)) {
    return { route : this.home, path : join('/', route) };
  }

  route = (route) ? route : this.home;
  path = join('/', parts.join('/'));

  return { route : route, path : path };
};
