var restify         = require('restify');
var allergies_model = require('../models/allergies.js');

var handler = require('../controllers/product_handler.js');

exports.filter_product = function(req, res, next) {
    var request = req.body;
    var user_allergens = ["lacteos", "so2"];

   // io.sockets.emit("notification", allergies.product);
    //io.to('34c68907f9c67fe0').emit('notification');
    var received = JSON.parse(request);
    var allergen = handler.handleProduct(received.product);
    var id = ""+received.id +"";
    if(user_allergens.indexOf(allergen) >= 0){
        io.to(id).emit('notification', {tag: allergen, name: received.product});
    }

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
    //io.to('34c68907f9c67fe0').emit('notification');

    //io.sockets.emit("notification", allergies.product);
    console.log(allergies);
    res.send(200);

};

exports.get_allergies_by_device = function(req, res, next){
  allergies_model.getByDevice(req.params[0], function(result){
    if(result.length === 0){
      res.send(404);
    }
    else{
      res.send(200, { data: result});
    }
  });
}
