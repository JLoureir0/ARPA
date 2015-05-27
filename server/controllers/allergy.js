var restify         = require('restify');
var allergies_model = require('../models/newAllergies.js');

//TODO Add all the allergies
var valid_allergies = 
[
'lacteos', 
'gluten', 
'amendoins', 
'ovos', 
'marisco', 
'moluscos',
'mostarda',
'peixe',
'sesamo',
'so2',
'soja',
'tremocos' ];


exports.handle_params = function(req, res, next) {
  if(req.params.deviceId){
    if(req.params.fbId){
      if(req.params.intolerant){
        if(JSON.parse(req.params.intolerant).constructor === Array){
          if(req.params.allergic){
            if(JSON.parse(req.params.allergic).constructor === Array){
              next();
            } else{
              next(new restify.InvalidArgumentError('allergic must be an array'));
            }
          } else{
            next(new restify.InvalidArgumentError('No allergies defined'));
          }

        } else{
          next(new restify.InvalidArgumentError('intolerant must be an array'));
        }
      } else{
        next(new restify.InvalidArgumentError('No intolerances defined'));
      }

    } else{
      next(new restify.InvalidArgumentError('No fbId defined'));
    }
  } else{
    next(new restify.InvalidArgumentError('No deviceId defined'));
  }
};

exports.new_user = function(req, res){
  var user = {};
  allergies_model.save(req.params[0], req.params.fbId, req.params.deviceId, req.params.intolerant, req.params.allergic, user, function(err, result){
    if(result){
      res.send(200, {data: user.id});
    } else{
      res.send(404);
    }
  });
};


exports.get_allergies = function(req, res) {
  allergies_model.get(req.params[0], function(result) {
    if(result.length === 0){
      res.send(404);
    }
    else{
      res.send(200, { data: result});
    }
  });
};

exports.update_allergies = function(req, res) {
  allergies_model.get(req.params[0], function(err, result) {
    if(result.rows.length === 0)
      res.send(404);
    else
      allergies_model.update(req.params[0], req.params.intolerant, req.params.allergic, function(err, result) {
        if(!result || result.rowCount === 1)
          allergies_model.get(req.params[0], function(err, result) {
            if(result.rows.length === 0)
              res.send(404);
            else
              res.send(200, { data: result.rows[0] });
          });
      });
  });
};

exports.delete_allergies = function(req, res) {
  allergies_model.get(req.params[0], function(err, result) {
    if(result.rows.length === 0)
      res.send(404);
    else
      allergies_model.delete(req.params[0], function(err, result) {
        if(result.rowCount === 1)
          res.send(200);
        else
          res.send(404);
      });
  });
};

function verify_allergies_attributes(allergies, next) {
  if(allergies.intolerant)
    parse_intolerant(allergies.intolerant, next);
  if(allergies.allergic)
    parse_allergic(allergies.allergic, next);
}

function parse_intolerant(intolerant, next) {
  var parsed = JSON.parse(intolerant);
  if(parsed.constructor !== Array)
    return next(new restify.InvalidArgumentError('intolerant must be an array'));

  parse_valid_allergies(parsed, 'intolerant', next);
}

function parse_allergic(allergic, next) {
  var parsed = JSON.parse(allergic);
  console.log("PARSED: " + allergic);
  if(parsed.constructor !== Array)
    return next(new restify.InvalidArgumentError('allergic must be an array'));
  parse_valid_allergies(parsed, 'allergic', next);
}

function parse_valid_allergies(array, type, next) {
  array.forEach(function(element) {
    if(valid_allergies.indexOf(element) === -1)
      return next(new restify.InvalidArgumentError(type + ' must be an array with valid values'));
  });
}
