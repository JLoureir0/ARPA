var allergy_controller = require('../controllers/allergy.js');

exports.define_routes = function(server) {
	server.get(/^\/allergies\/device\/(.+)/, allergy_controller.get_allergies_by_device);
	server.get(/^\/allergies\/(.+)/, allergy_controller.get_allergies);
  server.post(/^\/allergies\//, allergy_controller.handle_params, allergy_controller.new_user);
};
