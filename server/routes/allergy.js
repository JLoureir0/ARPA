var allergy_controller = require('../controllers/allergy.js');

exports.define_routes = function(server) {
  server.get(/^\/allergies\/(.+)/, allergy_controller.get_allergies);
  //server.put(/^\/allergies\/(.+)/, allergy_controller.handle_params, allergy_controller.update_allergies);
  //server.del(/^\/allergies\/(.+)/, allergy_controller.delete_allergies);
  server.post(/^\/allergies\//, allergy_controller.handle_params, allergy_controller.new_user);
};
