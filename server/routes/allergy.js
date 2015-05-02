var allergy_controller = require('../controllers/allergy.js');

exports.define_routes = function(server) {
  server.get(/^\/allergies\/(.+)\.json$/, allergy_controller.get_allergies);
};
