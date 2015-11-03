var db = require('./db');
var upsert = require('./upsert');

module.exports =
  {
    setHighscore:setHighscore,
    getHighscore:getHighscore
  };

function setHighscore (data) {
  /*var username = this.request.body.username;
  var points = parseInt(this.request.body.points, 10);*/
  var err;

  var username = data.username;
  var points = data.points;

  console.log("setHighscore");
  console.log("username: " +username);
  console.log("points: " +points);

  if(!validate(username, points)){
    console.log("wrong username");
    return null;
  }

  saveHighscore(username, points).then(() => {
    console.log("es wurde geschrieben");
    return true;
  }).catch(err => console.error(err));

}

function* getHighscore() {
  var username = this.request.body.username;
  var err;

  if(!validate(username)){
    err = {
      codeNr:1,
      message: "wrong validate"
    };
    this.response.body = err;
    this.response.status = 400;
    return err;
  }

  var rows = yield getList(username);
  if(!rows){
    err = {
      codeNr:2,
      message: "list empty"
    };
    this.response.body = err;
    this.response.status = 400;
    return err;
  }

  this.response.body = rows;
  return this.response.status = 200;
}

function getList (username){
  return db('highscore').select().where("user_id", username)
    .then(rows => {
      if(!rows || rows.length === 0){
        return null;
      }
      return rows;
    });
    return true;
}

function saveHighscore(username, points) {
  var today = new Date();

  return upsert(
    "highscore",
    {
      user_id: username
    },
    {
      user_id: username,
      points: points,
      created: today
    }
  );
}

function validate(username, points){
  if(!username || username.length > 16){
    return false;
  }

  if(!(/[a-z][a-z0-9]*/i.test(username))){
    return false;
  }

  if(!points){
    return false;
  }

  if(points < 0){
    return false;
  }

  return true;
}

function validate(username){
  if(!username || username.length > 16){
    return false;
  }

  if(!(/[a-z][a-z0-9]*/i.test(username))){
    return false;
  }

  return true;
}
