var db = require('./db');
var upsert = require('./upsert');

module.exports =
  {
    setHighscore:setHighscore,
    getHighscore:getHighscore
  };

function* setHighscore () {
  var username = this.request.body.username;
  var points = parseInt(this.request.body.points, 10);
  var err;

  console.log("setHighscore");
  console.log("username: " +username);
  console.log("points: " +points);

  if(!validate(username, points)){
    err = {
      codeNr:1,
      message: "wrong validate"
    };
    this.response.body = err;
    this.response.status = 400;
    return err;
  }

  if(!(yield saveHighscore(username, points))){
    err = {
      codeNr:2,
      message: "cant write in db"
    };
    this.response.body = err;
    this.response.status = 400;
    return err;
  }

  return this.response.status = 200;
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
