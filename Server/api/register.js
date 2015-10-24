var db = require('./db');
var bcrypt = require('bcryptjs');
var upsert = require('./upsert');

module.exports = register;

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
  return hashPassword(password).then(hash => {
    return db("users").insert({
      name: username,
      password: hash
    });
  });
}

function hashPassword(password){
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function(err, salt) {
      if(err){
        return reject(err);
      }

      bcrypt.hash(password, salt, function(err, hash) {
        if(err){
          return reject(err);
        }

        return resolve(hash);
      });
    });
  });
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
