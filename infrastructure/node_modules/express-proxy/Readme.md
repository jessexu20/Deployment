
# express-proxy

  Minimal proxy server for express

## Installation

    npm install express-proxy

## Usage

### /blog.js

```js
var express = require('express'),
    app = module.exports = express();

app.get('/', function(req, res) {
  res.send('hi from blog!');
});

app.post('/publish', function(req, res) {
  res.send('successfully published');
});
```

### /index.js

```js
var express = require('express'),
    app = module.exports = express();

app.use(express.favicon());

app.get('/', function(req, res) {
  res.send('hi from index!');
});
```

### /proxy.js
```js
var proxy = require('../');
    server = proxy(__dirname);

server.listen(8080, function() {
  console.log('Server started on port 8080');
});
```

---

### GET / 
    => 'hi from index!'

### GET /blog
    => 'hi from blog!'

### POST /blog/publish
    => 'successfully published!'

## API

### `Proxy(root|options)`

Initializes a new `Proxy` server. `root` is the only required parameter. If you pass in a string, it will assign the string to `root`. You may also pass in an options object. Some options include:

```js
var proxy = Proxy({
  root : __dirname,
  home : 'blog'
});
```

By passing in the `home` option, you will tell the proxy server that `GET /` will proxy to `GET blog/`.

Initializing `Proxy` will return an express `app` function, that you can use to set up additional configuration.

## Running the tests

    npm install
    make test

## License 

(The MIT License)

Copyright (c) 2012 Matt Mueller &lt;mattmuelle@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
