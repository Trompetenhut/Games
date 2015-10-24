var db = require('./db');
var bcrypt = require('bcryptjs');
var upsert = require('upsert');


function* register(){
  var username = this.request.body.username;
  var password = this.request.body.password;

  if(!validate(username, password)){
    return this.response.status = 400;
  }

  var userNameTaken = yield isUsernameTaken(username);

  if(userNameTaken){
    this.body = "Username already Taken";
    return this.response.status = 400;
  }

  yield registerUser(username, password);
  return this.response.status = 200;
}

function registerUser(username, password) {



  return upsert("users", {name: username}, {name: username, password: password});
}

function isUsernameTaken(username) {
  return db("users").select().where("name", username).then(rows => {
    return rows.length === 0;
  });
}

function validate(username, password) {
  if(!username || username.length > 16){
    return false;
  }

  if(!(/[a-z][a-z0-9]*/i.test(username))){
    return false;
  }

  if(!password || password.length > 100){
    return false;
  }

  return true;
}
