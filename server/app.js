var restify = require('restify');
var server  = restify.createServer({ name: 'ARPA' });

var logger = require('restify-logger');

var greetings = 'Connect with ARPA';

server.use(restify.fullResponse());
server.use(restify.bodyParser());

server.use(logger('dev'));

server.use(function(req, res, next) {
  res.charSet('utf-8');
  next();
});

server.listen(3000, function() {
  console.log(server.name + ' listening at ' + server.url);
});

server.get('/', function(req, res) {
  res.send({ data: greetings });
});
