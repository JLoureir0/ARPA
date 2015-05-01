var connection = require('../db/connection.js');

exports.save = function(id, intolerant, allergic, cb) {
  connection.query("INSERT INTO user_allergy VALUES('" + id + "',"
      + array_parser(intolerant) + "," + array_parser(allergic) +");", cb);
}

exports.get = function(id, cb) {
  connection.query("SELECT * FROM user_allergy WHERE _id='" + id + "';", cb);
}

exports.delete = function(id, cb) {
  connection.query("DELETE FROM user_allergy WHERE _id='" + id + "';", cb);
}

function array_parser(array) {
  //Converts array to => ARRAY['x,'y','z']
  return ('ARRAY'+ JSON.stringify(array)).replace(/"/g, "'");
}
