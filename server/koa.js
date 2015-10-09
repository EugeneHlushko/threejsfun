import path from 'path'
import fs from 'fs'
import debug from 'debug'

import koa from 'koa'
import hbs from 'koa-hbs'
import mount from 'koa-mount'
import helmet from 'koa-helmet'
import logger from 'koa-logger'
import favicon from 'koa-favicon'
import route from 'koa-route'
import staticCache from 'koa-static-cache'
import responseTime from 'koa-response-time'
import cors from 'koa-cors'

import api from './api.js'

const app = koa();
const env = process.env.NODE_ENV || 'development';
// cache static assets
const cacheOpts: Object = {maxAge: 86400000, gzip: true};
const config = {
  port: 8181,
  dir: path.join(__dirname, '../app/')
};

const readFile = (src) => {
  return new Promise(function (resolve, reject) {
    fs.readFile(src, {'encoding': 'utf8'}, (err, data) => {
      if(err) return reject(err);
    resolve(data);
  });
});
}
debug.enable('koa');

app.use(cors());

// add header `X-Response-Time`
app.use(responseTime());
app.use(logger());

// various security headers
app.use(helmet.defaults());

//console.log(path.join(__dirname, '../../search_engine/'));

// mount assets
//app.use(favicon(path.join(__dirname, '../../search_engine/images/favicon.ico')));
app.use(mount('/css', staticCache(path.join(config.dir + 'css/'), cacheOpts)));
app.use(mount('/js', staticCache(path.join(config.dir + 'js/'), cacheOpts)));
app.use(mount('/img', staticCache(path.join(config.dir + 'img/'), cacheOpts)));

// index
app.use(route.get('/', function *(){
  this.body = yield readFile(config.dir + 'index.html');
}));

app.use(api);

app.listen(config.port);
// Tell parent process koa-server is started
if (process.send) process.send('online');
debug('koa')(`Application started on port ${config.port}`);
