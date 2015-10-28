require('dotenv').load();

var koa = require('koa');
var routerPublic = require('koa-router')({
  prefix: '/api'
});
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

routerPublic.post("/register", require("./api/register"));
routerPublic.post('/login', require('./api/login'));
routerPublic.post("/highscoreList", require('./api/highscoreList'));

routerSecret.use(auth({ secret: process.env.SECRET })); // Um Routen danach aufzurufen muss der Benutzer eingeloggt sein
routerSecret.post("/setHighscore", require('./api/highscore').setHighscore);
routerSecret.post("/getHighscore", require('./api/highscore').getHighscore);

app.listen(process.env.PORT);

console.log('Server listening on port', process.env.PORT);
