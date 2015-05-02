var restify         = require('restify');
var allergies_model = require('../models/allergies.js');

exports.get_allergies = function(req, res) {
  allergies_model.get(req.params[0], function(err, result) {
    if(result.rows.length === 0)
      res.send(404);
    else
      res.send(200, { data: result.rows[0] });
  });
};
