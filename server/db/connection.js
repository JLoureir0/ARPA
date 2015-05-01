var pg = require('pg');
var connection = "postgres://postgres:ARPA@localhost:5432/ARPA";

exports.query = function(query, cb) {
  var client = new pg.Client(connection);

  client.connect(function(err) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }
    client.query(query, function(err, result) {
      if(err) {
        console.error('error running query: ', err.detail);
      }
      client.end();
      cb(err, result);
    });
  });
};
