require('dotenv').load();

var koa = require('koa');
var router = require('koa-router')({
  prefix: '/api'
});
var fileServer = require('koa-static');
var bodyparser = require('koa-bodyparser');
var auth = require('koa-auth-jwt');
var logger = require('koa-logger')
var app = koa();

app.use(fileServer("public"));
app.use(bodyparser());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(logger());

router.post("/register", require("./api/register"));
router.post('/login', require('./api/login'));
//router.use(auth({ secret: process.env.SECRET })); // Um Routen danach aufzurufen muss der Benutzer eingeloggt sein
router.post("/highscore", require('./api/highscore'));

//app.listen(process.env.PORT);
app.listen(80);

console.log('Server listening on port', process.env.PORT);
