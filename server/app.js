var restify = require('restify');
var server  = restify.createServer({ name: 'ARPA' });
var socket_io = require('socket.io');
var logger = require('restify-logger');
io = socket_io.listen(server.server);

var root_route       = require('./routes/root.js');
var allergies_routes = require('./routes/allergies.js');
var allergy_routes   = require('./routes/allergy.js');
var filter_routes   = require('./routes/product_filter.js');

restify.CORS.ALLOW_HEADERS.push('accept');
restify.CORS.ALLOW_HEADERS.push('sid');
restify.CORS.ALLOW_HEADERS.push('lang');
restify.CORS.ALLOW_HEADERS.push('origin');
restify.CORS.ALLOW_HEADERS.push('withcredentials');
restify.CORS.ALLOW_HEADERS.push('x-requested-with');
server.use(restify.CORS({'origins': ['http://localhost:8100']}));

//Middleware
server.use(restify.fullResponse());
server.use(restify.bodyParser());

server.use(logger('dev'));

server.use(function(req, res, next) {
  res.charSet('utf-8');
  next();
});

/*server.use(
    function crossOrigin(req, res, next){
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Content-Type");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
      res.header("Access-Control-Allow-Credentials", "false");
      return next();
    }
); */


//Routes
root_route.define_route(server);
allergies_routes.define_routes(server);
allergy_routes.define_routes(server);
filter_routes.define_routes(server);

io.sockets.on('connection', function(socket){
  console.log('socket connected');

  socket.on('disconnect', function(){
    console.log('socket disconnected');
  });

  socket.emit('text', 'wow. nice');
})

//Running server
server.listen(process.env.PORT || 3000, function() {
  console.log(server.name + ' listening at ' + server.url);
});
