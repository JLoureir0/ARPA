var allergy_controller = require('../controllers/allergy.js');

exports.define_routes = function(server) {
  server.get(/^\/allergies\/(.+)\.json$/, allergy_controller.get_allergies);
  server.put(/^\/allergies\/(.+)\.json$/, allergy_controller.handle_params, allergy_controller.update_allergies);
  server.del(/^\/allergies\/(.+)\.json$/, allergy_controller.delete_allergies);
};
