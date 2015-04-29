var restify = require('restify');
var server  = restify.createServer({ name: 'ARPA' });

var logger = require('restify-logger');

server.use(restify.fullResponse());
server.use(restify.bodyParser());

server.use(logger('dev'));

server.listen(3000, function() {
  console.log(server.name + ' listening at ' + server.url);
});
