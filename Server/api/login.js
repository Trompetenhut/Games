var db = require('./db');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

module.exports = login;

function* login(username, password) {
  var username = this.request.body.username;
  var password = this.request.body.password;
  var err;

  console.log("username: " + username);
  console.log("password: " + password);

  if(!validate(username, password)){
    err = {
      codeNr:1,
      message: "wrong validate"
    };
    this.response.body = err;
    this.response.status = 400;
    return err;
  }

  var user = yield getUserByName(username);

  if(!user){
    err = {
      codeNr:2,
      message: "Wrong username or password"
    };
    this.response.body = err;
    this.response.status = 401;
    return err;
  }

  if(!(yield checkPassword(username, password))){
    err = {
      codeNr:3,
      message: "Wrong username or password"
    };
    this.response.body = err;
    this.response.status = 401;
    return err;
  }

  /*
    Erfolgreich eingeloggt, Login Token mit 'jsonwebtoken' erstellen
    Das erste Argument von jwt.sign() wird mit einem geheimen String verschlüsselt
    Um später herauszufinden welcher Benutzer sich hinter dem Login Token verbirgt
    wird die id des Benutzers im Token verschlüsselt
  */
  var token = jwt.sign({ id: user.id }, process.env.SECRET);

  return this.response.body = { token };
}

function getUserByName(username){
  return db('users').select('name', 'password').where('name', username)
    .then(rows => {
      if(!rows || rows.length === 0){
        return null;
      }

      return rows[0];
    });
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
