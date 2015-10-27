var knex = require('knex');
var db = knex({
  client: 'mysql2',
  connection: {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  },
  pool: {
   min: 2,
   max: 10
  }
});
setInterval(() => {
    db.raw('SELECT 1').then(() => {
        console.log('ping MySQL');
    }).catch(err => {
        console.error(err.stack);
    });
}, 60 * 60 * 1000);
module.exports = db;
