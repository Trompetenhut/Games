var knex = require('knex');
var db = knex({
  client: 'mysql2',
  connection: {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  },
});
module.exports = db;
