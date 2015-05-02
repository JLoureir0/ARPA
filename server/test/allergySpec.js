var expect  = require('chai').expect;
var restify = require('restify');

var allergies_model = require('../models/allergies.js');

var allergies = {
  _id         : 'userid',
  intolerant  : ['milk'],
  allergic    : ['peanuts', 'eggs']
};

var client = restify.createJsonClient({
  url: 'http://localhost:3000'
});

var url = 'http://localhost:3000/allergies/' + allergies._id + '.json';

describe('/allergies/:id.json', function() {
  before(function(done) {
    client.post('/allergies.json', allergies, function(err, req, res, obj) {
      expect(res.statusCode).to.be.equal(201);
      done();
    });
  });
  describe('get request', function() {
    it('should return 200 if _id is valid', function(done) {
      client.get(url, function(err, req, res, obj) {
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
    it('should return 404 if url is a substring of /allergies/:id.json', function(done) {
      client.get('/asdasdasd' + url, function(err, req, res, obj) {
        expect(res.statusCode).to.be.equal(404);
        client.get(url + 'asdasdas', function(err, req, res, obj) {
          expect(res.statusCode).to.be.equal(404);
          done();
        });
      });
    });
    it('should return 404 if _id is invalid', function(done) {
      client.get('/allergies/inv@lid.json', function(err, req, res, obj) {
        expect(res.statusCode).to.be.equal(404);
        done();
      });
    });
    it('should return a json with a data property', function(done) {
      client.get(url, function(err, req, res, obj) {
        expect(obj).to.have.a.property('data');
        done();
      });
    });
    it('should return an object in the data property', function(done) {
      client.get(url, function(err, req, res, obj) {
        expect(typeof obj.data).to.be.equal('object');
        expect(obj.data).not.to.be.an.instanceof(Array);
        done();
      });
    });
    it('should return the correct user in the data object', function(done) {
      client.get(url, function(err, req, res, obj) {
        expect(obj.data).to.be.deep.equal(allergies);
        done();
      });
    });
  });
});
