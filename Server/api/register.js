var db = require('./db');
var bcrypt = require('bcryptjs');

module.exports = register;

function* register(){
  var username = this.request.body.username;
  var password = this.request.body.password;
  var email = this.request.body.email;
  var err;

  if(!validate(username, password, email)){
    err = {
      codeNr:1,
      message: "wrong validate"
    };
    this.response.body = err;
    this.response.status = 400;
    return err;
  }

  var userNameTaken = yield isUsernameTaken(username);

  if(userNameTaken){
    err = {
      codeNr:2,
      message: "Username already taken"
    };
    this.response.body = err;
    this.response.status = 400;
    return err;
  }

  var emailTaken = yield isEmailTaken(email);

  if(userNameTaken){
    err = {
      codeNr:3,
      message: "Email already taken"
    };
    this.response.body = err;
    this.response.status = 400;
    return err;
  }

  yield registerUser(username, password, email);
  return this.response.status = 200;
}

function registerUser(username, password, email) {
  return hashPassword(password).then(hash => {
    return db("users").insert({
      name: username,
      password: hash,
      mail: email
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
    return (rows && rows.length > 0);
  });
}

function isEmailTaken(email) {
  return db("users").select().where("mail", email).then(rows => {
    return (rows && rows.length > 0);
  });
}

function validate(username, password, email) {
  if(!username || username.length > 16){
    return false;
  }

  if(!(/[a-z][a-z0-9]*/i.test(username))){
    return false;
  }

  if(!password || password.length > 100){
    return false;
  }

  if(!email || email.length > 30){
    return false;
  }

  return true;
}
