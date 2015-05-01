var restify         = require('restify');
var allergies_model = require('../models/allergies.js');

//TODO Add all the allergies
var valid_allergies = ['milk', 'peanuts', 'eggs'];

exports.handle_params = function(req, res, next) {
  parse_allergies(req.params);
  verify_allergies_attributes(req.params, next);

  next();
};

exports.save_allergies = function(req, res, next) {
  var allergies = req.params;
  allergies_model.save(allergies._id, allergies.intolerant, allergies.allergic, function(err, result) {
    if(err)
      return next(new restify.ForbiddenError(err.detail));
    console.log('Inserted the allergies of user "' + allergies._id + '" to the database');
    res.send(201, { data: req.params });
  });
}

function parse_allergies(allergies) {
  var allergies_attributes = [
    '_id',
    'intolerant',
    'allergic'
  ];

  for(var key in allergies) {
    if (allergies_attributes.indexOf(key) === -1)
      delete allergies[key];
  }
}

function verify_allergies_attributes(allergies, next) {
  parse_id(allergies._id, next);
  parse_intolerant(allergies.intolerant, next);
  parse_allergic(allergies.allergic, next);
}

function parse_id(id, next) {
  if(id === undefined)
    return next(new restify.InvalidArgumentError('_id must be supplied'));
  if(typeof id !== 'string' || !(/^[a-zA-Z0-9]+$/.test(id)))
    return next(new restify.InvalidArgumentError('_id must be an alphanumeric string'));
}

function parse_intolerant(intolerant, next) {
  if(intolerant === undefined)
    return next(new restify.InvalidArgumentError('intolerant must be supplied'));
  if(intolerant.constructor !== Array)
    return next(new restify.InvalidArgumentError('intolerant must be an array'));

  intolerant.forEach(function(element) {
    if(valid_allergies.indexOf(element) === -1)
      return next(new restify.InvalidArgumentError('intolerant must be an array with valid values'));
  });
}

function parse_allergic(allergic, next) {
  if(allergic === undefined)
    return next(new restify.InvalidArgumentError('allergic must be supplied'));
  if(allergic.constructor !== Array)
    return next(new restify.InvalidArgumentError('allergic must be an array'));

  allergic.forEach(function(element) {
    if(valid_allergies.indexOf(element) === -1)
      return next(new restify.InvalidArgumentError('allergic must be an array with valid values'));
  });
}
