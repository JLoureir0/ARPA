var restify         = require('restify');
var allergies_model = require('../models/allergies.js');

exports.filter_product = function(req, res, next) {
    var allergies = req.params;

    //io.sockets.emit("notification", allergies.product);
    console.log(allergies);
    res.send(200);

    /*allergies_model.save(allergies._id, allergies.intolerant, allergies.allergic, function(err, result) {
     if(err)
     return next(new restify.ForbiddenError(err.detail));
     console.log('Inserted the allergies of user "' + allergies._id + '" to the database');
     res.send(201, { data: req.params });
     });*/
};

exports.filter_product_get = function(req, res, next) {
    var product = req.query.product;

    console.log(product);


    //io.sockets.emit("notification", allergies.product);
    console.log(allergies);
    res.send(200);

};
