
// const mysql = require('mysql');
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '123456',
//   database: 'kharchadekho'
// });
// db.connect(err => {
//   if (err) throw err;
//   console.log('MySQL Connected...');
// });
// module.exports = db;

const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

module.exports = db;
