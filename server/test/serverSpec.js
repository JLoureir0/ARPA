var expect = require('chai').expect;
var restify = require('restify');

var client = restify.createJsonClient({
  url: 'http://localhost:3000'
});

var greetings = 'Connect with ARPA';

describe('Server', function() {
  it('should be running', function(done) {
    client.get('/', function(err, req, res, obj) {
      expect(res.statusCode).to.be.equal(200);
      expect(obj.data).to.be.deep.equal(greetings);
      done();
    });
  });
  it('should return 404 if the url is invalid', function(done) {
    client.get('/abc', function(err, req, res, obj) {
      expect(res.statusCode).to.be.equal(404);
      done();
    });
  });
  it('should have Content-Type: application/json; charset=utf-8', function(done) {
    client.get('/', function(err, req, res, obj) {
      expect(res.headers['content-type']).to.be.equal('application/json; charset=utf-8');
      done();
    });
  });
});
