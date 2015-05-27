var connection = require('../db/connection.js');


exports.save = function(appId, fbId, deviceId, intolerant, allergic, user, cb) {
	var query = 'BEGIN;'
	var allergicArr = JSON.parse(allergic);
	var intolerantArr = JSON.parse(intolerant);

	connection.query("SELECT appID FROM CLIENT WHERE fbID='" + fbId + "';", function(err, result){
		if(!result || result.rowCount == 0){
			var subQuery = 'INSERT INTO client(fbID, deviceID) VALUES(' + fbId + "," + deviceId + ") RETURNING appID;";
			connection.query(subQuery, function(err2, result2){
				user.id = result2.rows[0].appid;
				for(var i = 0; i < allergicArr.length; i++){
					query += 'INSERT INTO CLIENTS_TO_ALLERGIC(CLIENTID, ALLERGEN) VALUES(' + user.id + ',' + JSON.stringify(allergicArr[i]).replace(/"/g, "'") + ');';
				}
				for(var i = 0; i < intolerantArr.length; i++){
					query += 'INSERT INTO CLIENTS_TO_INTOLERANCE(CLIENTID, ALLERGEN) VALUES(' + user.id + ',' + JSON.stringify(intolerantArr[i]).replace(/"/g, "'") + ');';
				}
				query += 'COMMIT;';
				connection.query(query, cb);
			});
		} else {
			user.id = result.rows[0].appid;
			query += "UPDATE CLIENT SET DEVICEID=" + deviceId + " WHERE APPID='" + user.id + "';";
			query += "DELETE FROM CLIENTS_TO_ALLERGIC WHERE CLIENTID='" + user.id + "';";
			query += "DELETE FROM CLIENTS_TO_INTOLERANCE WHERE CLIENTID='" + user.id + "';";
			for(var i = 0; i < allergicArr.length; i++){
				query += 'INSERT INTO CLIENTS_TO_ALLERGIC(CLIENTID, ALLERGEN) VALUES(' + user.id + ',' + JSON.stringify(allergicArr[i]).replace(/"/g, "'") + ');';
			}
			for(var i = 0; i < intolerantArr.length; i++){
				query += 'INSERT INTO CLIENTS_TO_INTOLERANCE(CLIENTID, ALLERGEN) VALUES(' + user.id + ',' + JSON.stringify(intolerantArr[i]).replace(/"/g, "'") + ');';
			}
			query += 'COMMIT;';
			connection.query(query, cb);
		}

	});	
};

exports.get = function(fbId, cb){
	var allergicQuery = "SELECT ALLERGEN FROM CLIENTS_TO_ALLERGIC C INNER JOIN CLIENT CL ON C.CLIENTID = CL.APPID AND CL.FBID='" + fbId + "';";
	var intolerantQuery = "SELECT ALLERGEN FROM CLIENTS_TO_INTOLERANCE C INNER JOIN CLIENT CL ON C.CLIENTID = CL.APPID AND CL.FBID='" + fbId + "';";
	var finalResult = {allergic:[], intolerant:[]};

	connection.query(allergicQuery, function(err, result){
		for(var i = 0; i < result.rows.length; i++){
			finalResult.allergic.push(result.rows[i].allergen);
		}

		connection.query(intolerantQuery, function(err2, result2){
			for(var i = 0; i < result2.rows.length; i++){
				finalResult.intolerant.push(result2.rows[i].allergen);
			}

			cb(finalResult);
		});

	});


};

