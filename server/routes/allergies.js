var allergies_controller = require('../controllers/allergies.js');

exports.define_routes = function(server) {
  server.post('/allergies.json', allergies_controller.handle_params, function(req, res) {
    res.send(201, { data: req.params });
  });
};
