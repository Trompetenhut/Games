var db = require('./db');

module.exports = upsert;

function upsert(table, where, value){
  return db(table).select().where(where).then(rows => {
    if(rows.length === 1){
      return db(table).update(value).where(where);
    }else{
      return db(table).insert(value);
    }
  });
}
