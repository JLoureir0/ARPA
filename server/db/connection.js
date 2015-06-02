var pg = require('pg');
var connection = process.env.DATABASE_URL || "postgres://juetfbianfpneo:cz3KH0q4yCZJ0bkBue7TNRUvSc@ec2-54-247-79-142.eu-west-1.compute.amazonaws.com:5432/derkd5u2qt7037";

exports.query = function(query, cb) {
  var client = new pg.Client(connection);

  client.connect(function(err) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }else{
      console.log("connected")
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
