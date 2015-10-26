var db = require('./db');
var bcrypt = require('bcryptjs');

module.exports = login;

function* login(username, password) {
  var username = this.request.body.username;
  var password = this.request.body.password;
  var err;

  if(!validate(username, password)){
    err = {
      codeNr:1,
      message: "wrong validate"
    };
    this.response.body = err;
    this.response.status = 400;
    return err;
  }

  if(!(yield checkPassword(username, password))){
    err = {
      codeNr:2,
      message: "Wrong username or password"
    };
    this.response.body = err;
    this.response.status = 401;
    return err;
  }

  this.body = "Login successful"; //TODO: Login Token
  return this.response.status = 200;
}

function checkPassword(username, password) {
  return db("users").select("password").where("name", username).then( rows =>{
      if(!rows || rows.length === 0){
        return false;
      }
      var user = rows[0];

      return comparePassword(password, user.password);
      return true;
  });
}

function comparePassword(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function(err, res) {
      if(err){
        return reject(err);
      }

      return resolve(res);
    });
  });
}

function validate(username, password) {
  if(!username || !password){
    return false;
  }
  return true;
}
