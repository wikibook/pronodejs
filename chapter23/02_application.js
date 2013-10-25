var mysql = require('mysql');

var client = mysql.createClient({
  host: 'localhost',
  user: 'root',
  password: 'root',
});

client.query('DROP DATABASE IF EXISTS node');
client.query('CREATE DATABASE node');
client.query('USE node');

client.query('CREATE TABLE test ' +
             '(id INT(11) AUTO_INCREMENT, ' +
             ' content VARCHAR(255), ' +
             ' PRIMARY KEY(id))'
);

for (var i = 0; i < 10000; i++) {
  client.query('INSERT INTO test (content) VALUES (?)', ['content for row ' + (i + 1)]);
}

client.query('UPDATE test SET content = ? WHERE id >= ?', ['new content', 9000],
  function(err, info) {
    console.log('Changed content of ' + info.affectedRows + ' rows');
  }
);

query = client.query('SELECT id, content FROM test WHERE id >= ? AND id <= ?',
  [8990, 9010]);

query.on('error', function(err) {
  throw err;
});

query.on('row', function(row) {
  console.log('Content of row #' + row.id + ' is: "' + row.content + '"');
});

query.on('end', function(result) {
  console.log('Finished retrieving results');
});

client.end();