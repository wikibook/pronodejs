var mysql = require('mysql');

var client = mysql.createClient({
  host: 'localhost',
  user: 'root',
  password: 'root'
});

client.query(
  'SELECT "Hello, world!"',
  function (err, results, fields) {
    console.log(results);
    console.log(fields);
    client.end();
  }
);