var restify         = require('restify');
var allergies_model = require('../models/allergies.js');

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
  allergies_model.save(req.params.appId, req.params.fbId, req.params.deviceId, req.params.intolerant, req.params.allergic, user, function(err, result){
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

exports.get_allergies_by_device = function(req, res){
  console.log("HERE");
  allergies_model.getByDevice(req.params[0], function(result){
    if(result.length === 0){
      res.send(404);
    }
    else{
      res.send(200, { data: result});
    }
  });
}

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
