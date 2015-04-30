var expect    = require('chai').expect;
var restify   = require('restify');

var allergies = {
  _id         : 'userid',
  intolerant  : ['milk'],
  allergic    : ['peanuts', 'eggs']
};

var client    = restify.createJsonClient({
  url: 'http://localhost:3000'
});

describe('/allergies.json', function() {
  describe('post request', function() {
    it('should return 201 on create', function(done) {
      client.post('/allergies.json', allergies, function(err, req, res, obj) {
        expect(res.statusCode).to.be.equal(201);
        done();
      });
    });
    it('should return the user on create in the data param', function(done) {
      client.post('/allergies.json', allergies, function(err, req, res, obj) {
        expect(res.statusCode).to.be.equal(201);
        expect(obj.data).to.be.deep.equal(allergies);
        done();
      });
    });
    it('should only parse the correct attributes', function(done) {
      var allergies_with_another_attribute = JSON.parse(JSON.stringify(allergies));
      allergies_with_another_attribute.invalid = 'invalid';

      client.post('/allergies.json', allergies_with_another_attribute, function(err, req, res, obj) {
        expect(res.statusCode).to.be.equal(201);
        expect(obj.data).to.be.deep.equal(allergies);
        done();
      });
    });
    it('should return 409 and an error message if no _id passed', function(done) {
      var allergies_with_no_id = JSON.parse(JSON.stringify(allergies));
      delete allergies_with_no_id._id;

      client.post('/allergies.json', allergies_with_no_id, function(err, req, res, obj) {
        expect(res.statusCode).to.be.equal(409);
        expect(obj.message).to.be.equal('_id must be supplied');
        done();
      });
    });
    it('should return 409 and an error message if _id is invalid', function(done) {
      var allergies_invalid_id = JSON.parse(JSON.stringify(allergies));
      allergies_invalid_id._id = 'invalid^';

      client.post('/allergies.json', allergies_invalid_id, function(err, req, res, obj) {
        expect(res.statusCode).to.be.equal(409);
        expect(obj.message).to.be.equal('_id must be an alphanumeric string');
        done();
      });
    });
    it('should return 409 and an error message if no intolerant passed', function(done) {
      var allergies_with_no_intolerant = JSON.parse(JSON.stringify(allergies));
      delete allergies_with_no_intolerant.intolerant;

      client.post('/allergies.json', allergies_with_no_intolerant, function(err, req, res, obj) {
        expect(res.statusCode).to.be.equal(409);
        expect(obj.message).to.be.equal('intolerant must be supplied');
        done();
      });
    });
    it('should return 409 and an error message if intolerant is not an array', function(done) {
      var allergies_string_intolerant = JSON.parse(JSON.stringify(allergies));
      allergies_string_intolerant.intolerant = 'string';

      client.post('/allergies.json', allergies_string_intolerant, function(err, req, res, obj) {
        expect(res.statusCode).to.be.equal(409);
        expect(obj.message).to.be.equal('intolerant must be an array');
        done();
      });
    });
    it('should return 409 and an error message if intolerant has invalid values', function(done) {
      var allergies_invalid_intolerant = JSON.parse(JSON.stringify(allergies));
      allergies_invalid_intolerant.intolerant = ['invalid'];

      client.post('/allergies.json', allergies_invalid_intolerant, function(err, req, res, obj) {
        expect(res.statusCode).to.be.equal(409);
        expect(obj.message).to.be.equal('intolerant must be an array with valid values');
        done();
      });
    });
  });
});
