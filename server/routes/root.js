var greetings = 'Connect with ARPA';

exports.define_route = function(server) {
  server.get('/', function(req, res) {
    res.send({ data: greetings });
  });
};
