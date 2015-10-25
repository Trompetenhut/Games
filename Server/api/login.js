var db = require('./db');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

module.exports = login;

function* login(){
  var username = this.request.body.username;
  var password = this.request.body.password;

  if(!validate(username, password)){
    return this.response.status = 400;
  }

  var user = yield getUserByName(username);

  if(!user){
    return this.response.status = 401;
  }

  if(!comparePassword(password, user.password)){
    return this.response.status = 401;
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

function validate(username, password) {
  return username && username.length <= 16 && password;
}

function getUserByName(username){
  return db('users').select('name', 'password').where('name', username)
    .then(rows => {
      if(rows.length === 0){
        return null;
      }

      return rows[0];
    });
}

function comparePassword(password, hash){
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) => {
      if(err){
        return reject(err);
      }

      return resolve(result);
    });
  });
}
