var filter_controller = require('../controllers/product_filter.js');

exports.define_routes = function(server) {
    server.post('/product_filter/:product', filter_controller.filter_product);
    server.get('/product_filter/', filter_controller.filter_product_get);
};
