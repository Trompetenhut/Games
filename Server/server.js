require('dotenv').load();

var koa = require('koa');
var router = require('koa-router')({
  prefix: '/api'
});
var fileServer = require('koa-static');
var bodyparser = require('koa-bodyparser');
var app = koa();

app.use(fileServer("public"));
app.use(bodyparser());
app.use(router.routes());
app.use(router.allowedMethods());

router.post("/register", require("./api/register"));
router.post("/login", require("./api/login"));
router.post("/highscore", require('./api/highscore'));

app.listen(80);

console.log("Server listening on port 80...");
