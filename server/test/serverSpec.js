var expect = require('chai').expect;
var restify = require('restify');

var client = restify.createJsonClient({
  url: 'http://localhost:3000'
});

describe('Server', function() {
  it('should be running', function(done) {
    client.get('/', function(err, req, res, obj) {
      done();
    });
  });
  it('should return 404 if the url is invalid', function(done) {
    client.get('/abc', function(err, req, res, obj) {
      expect(res.statusCode).to.be.equal(404);
      done();
    });
  });
});
