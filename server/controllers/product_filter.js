var restify         = require('restify');
var allergies_model = require('../models/allergies.js');
var handler = require('../controllers/product_handler.js');

exports.filter_product = function(req, res, next) {
    console.log("Entrei");
    var request = req.body;
    console.log(request);
    var received = request;
    var allergen = handler.handleProduct(received.product);
    var id = ""+received.id +"";
    console.log(received.id);


    allergies_model.getByDevice(id,function(result){
        console.log("cenas: " +  result + " cenas2: " + id);

        if(result.indexOf(allergen) >= 0){
            io.to(id).emit('notification', {tag: allergen, name: received.product});
        }
    });


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