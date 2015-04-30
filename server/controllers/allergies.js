var restify           = require('restify');
//TODO Add all the allergies
var valid_allergies   = ['milk', 'peanuts', 'eggs'];

exports.handle_params = function(req, res, next) {
  parse_allergies(req.params);
  verify_allergies_attributes(req.params, next);

  next();
};

function parse_allergies(allergies) {
  var allergies_attributes = [
    '_id',
    'intolerance',
    'allergic'
  ];

  for(var key in allergies) {
    if (allergies_attributes.indexOf(key) === -1)
      delete allergies[key];
  }
}

function verify_allergies_attributes(allergies, next) {
  parse_id(allergies._id, next);
  parse_intolerance(allergies.intolerance, next);
}

function parse_id(id, next) {
  if(id === undefined)
    return next(new restify.InvalidArgumentError('_id must be supplied'));
  if(typeof id !== 'string' || !(/^[a-zA-Z0-9]+$/.test(id)))
    return next(new restify.InvalidArgumentError('_id must be an alphanumeric string'));
}

function parse_intolerance(intolerance, next) {
  if(intolerance === undefined)
    return next(new restify.InvalidArgumentError('intolerance must be supplied'));
  if(intolerance.constructor !== Array)
    return next(new restify.InvalidArgumentError('intolerance must be an array'));

  intolerance.forEach(function(element) {
    if(valid_allergies.indexOf(element) === -1)
      return next(new restify.InvalidArgumentError('intolerance must be an array with valid values'));
  });
}
