var restify = require('restify');
var server  = restify.createServer({ name: 'ARPA' });

var logger = require('restify-logger');

var root_route       = require('./routes/root.js');
var allergies_routes = require('./routes/allergies.js');

//Middleware
server.use(restify.fullResponse());
server.use(restify.bodyParser());

server.use(logger('dev'));

server.use(function(req, res, next) {
  res.charSet('utf-8');
  next();
});

//Routes
root_route.define_route(server);
allergies_routes.define_routes(server);

//Running server
server.listen(3000, function() {
  console.log(server.name + ' listening at ' + server.url);
});
