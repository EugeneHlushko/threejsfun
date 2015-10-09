//// Tell `require` calls to look into `server/` also
//// it will avoid `../../../../../` require strings
process.env.NODE_PATH = 'server/';
require('module').Module._initPaths();
// Install `babel` hook for ES6
require('babel/register');
//// Start the server
require('./koa.js');
