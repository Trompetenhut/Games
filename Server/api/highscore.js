var db = require('./db');

module.exports = setHighscore;

function* setHighscore (next) {
  var username = this.request.body.username;
  var points = parseInt(this.request.body.points, 10);

  if(!validate(username, points)){
    return this.response.status = 400;
  }

  yield saveHighscore(username, points);
  return this.response.status = 200;
}

function saveHighscore (username, points){
  var selectTask = db("highscore").select("username").where("username", username);
  return selectTask.then(rows => {
    if(rows.length === 1){
      return db("highscore").update({username, points}).where("username", username);
    }else{
      return db("highscore").insert({username, points});
    }
  });
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
