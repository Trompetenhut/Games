var db = require('./db');

module.exports = getHighscoreList;

function* getHighscoreList () {
  var err;

  var rows = yield getList();
  if(!rows){
    err = {
      codeNr:1,
      message: "list empty"
    };
    this.response.body = err;
    this.response.status = 400;
    return err;
  }


  this.response.body = rows;
  return this.response.status = 200;
}

function getList (){
  return db('highscore').select().orderBy('points', 'desc').limit("10")
    .then(rows => {
      if(!rows || rows.length === 0){
        return null;
      }
      return rows;
    });
    return true;
}
