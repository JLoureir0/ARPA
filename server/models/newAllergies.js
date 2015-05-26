var connection = require('../db/connection.js');


exports.save = function(id, intolerant, allergic, cb) {
	var query = 'BEGIN;'

	for(var i = 0; i < allergic.length; i++){
		query += 'INSERT INTO CLIENTS_TO_ALLERGIC(CLIENTID, ALLERGEN) VALUES(' + id + ',' + allergic[i] + ');';
	}

	query += 'COMMIT';

	connection.query(query);
}


