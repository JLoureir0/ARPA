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
  describe('put request', function() {
    it('should return 200 if user id is valid', function(done) {
      client.put(url, {}, function(err, req, res, obj) {
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
    it('should return the allergies in the data property on update', function(done) {
      allergies.intolerant = ['shrimp'];
      client.put(url, { intolerant: ['shrimp'] }, function(err, req, res, obj) {
        expect(obj.data).to.be.deep.equal(allergies);
        done();
      });
    });
    it('should only parse the correct attributes', function(done) {
      client.put(url, { invalid: 'invalid' }, function(err, req, res, obj) {
        expect(obj.data).to.be.deep.equal(allergies);
        done();
      });
    });
    it('should return 404 if url is a substring of /allergies/:id.json', function(done) {
      client.put('/asdasdasd' + url, {}, function(err, req, res, obj) {
        expect(res.statusCode).to.be.equal(404);
        client.put(url + 'asdasdas', {}, function(err, req, res, obj) {
          expect(res.statusCode).to.be.equal(404);
          done();
        });
      });
    });
    it('should return 404 if _id is invalid', function(done) {
      client.put('/allergies/inv@lid.json', {}, function(err, req, res, obj) {
        expect(res.statusCode).to.be.equal(404);
        done();
      });
    });
    it('should return 409 and an error message if intolerant is not an array', function(done) {
      client.put(url, { intolerant: 'string' }, function(err, req, res, obj) {
        expect(res.statusCode).to.be.equal(409);
        expect(obj.message).to.be.equal('intolerant must be an array');
        done();
      });
    });
    it('should return 409 and an error message if intolerant has invalid values', function(done) {
      client.put(url, { intolerant: ['invalid'] }, function(err, req, res, obj) {
        expect(res.statusCode).to.be.equal(409);
        expect(obj.message).to.be.equal('intolerant must be an array with valid values');
        done();
      });
    });
    it('should return 409 and an error message if allergic is not an array', function(done) {
      client.put(url, { allergic: 'string' }, function(err, req, res, obj) {
        expect(res.statusCode).to.be.equal(409);
        expect(obj.message).to.be.equal('allergic must be an array');
        done();
      });
    });
    it('should return 409 and an error message if allergic has invalid values', function(done) {
      client.put(url, { allergic: ['invalid'] }, function(err, req, res, obj) {
        expect(res.statusCode).to.be.equal(409);
        expect(obj.message).to.be.equal('allergic must be an array with valid values');
        done();
      });
    });
  });
});
