var connection = require('../db/connection.js');

exports.save = function(id, intolerant, allergic, cb) {
  connection.query("INSERT INTO user_allergy VALUES('" + id + "'," + array_parser(intolerant) + "," + array_parser(allergic) +");", cb);
};

exports.get = function(id, cb) {
  connection.query("SELECT * FROM user_allergy WHERE _id='" + id + "';", cb);
};

exports.delete = function(id, cb) {
  connection.query("DELETE FROM user_allergy WHERE _id='" + id + "';", cb);
};

exports.update = function(id, intolerant, allergic, cb) {
  if(intolerant && allergic)
    update_intolerant(id, intolerant, function() {
      update_allergic(id, allergic, cb);
    });
  else if(intolerant)
    update_intolerant(id, intolerant, cb);
  else if(allergic)
    update_allergic(id, allergic, cb);
  else
    cb();
};

function array_parser(array) {
  //Converts array to => ARRAY['x,'y','z']
  return ('ARRAY'+ JSON.stringify(array)).replace(/"/g, "'");
}

function update_intolerant(id, intolerant, cb) {
  connection.query("UPDATE user_allergy SET intolerant = "+ array_parser(intolerant) + " WHERE _id = '" + id + "';", cb);
}

function update_allergic(id, allergic, cb) {
  connection.query("UPDATE user_allergy SET allergic = "+ array_parser(allergic) + " WHERE _id = '" + id + "';", cb);
}
