require('dotenv').load();

var koa = require('koa');
var routerPublic = require('koa-router')();
var routerSecret = require('koa-router')({
  prefix: '/api'
});
var fileServer = require('koa-static');
var bodyparser = require('koa-bodyparser');
var auth = require('koa-auth-jwt');
var logger = require('koa-logger')
var app = koa();

app.use(fileServer("public"));
app.use(bodyparser());
app.use(routerPublic.routes());
app.use(routerPublic.allowedMethods());
app.use(routerSecret.routes());
app.use(routerSecret.allowedMethods());
app.use(logger());

routerPublic.post("/api/register", require("./api/register"));
routerPublic.post('/api/login', require('./api/login'));
routerPublic.post("/api/highscoreList", require('./api/highscoreList'));
routerPublic.post("/api/forgot", require('./api/forgot').forgot);
routerPublic.get("/reset/:token", require('./api/forgot').checkToken);
routerPublic.post("/reset/:token", require('./api/forgot').resetPassword);

routerSecret.use(auth({ secret: process.env.SECRET })); // Um Routen danach aufzurufen muss der Benutzer eingeloggt sein
routerSecret.post("/setHighscore", require('./api/highscore').setHighscore);
routerSecret.post("/getHighscore", require('./api/highscore').getHighscore);

app.listen(process.env.PORT);

console.log('Server listening on port', process.env.PORT);
