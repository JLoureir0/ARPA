DROP TABLE IF EXISTS CLIENT CASCADE;
DROP TABLE IF EXISTS ALLERGENS CASCADE;
DROP TABLE IF EXISTS CLIENTS_TO_ALLERGIC CASCADE;
DROP TABLE IF EXISTS CLIENTS_TO_INTOLERANCE CASCADE;

CREATE TABLE CLIENT(
	appID SERIAL,
	fbID VARCHAR(20) DEFAULT '',
	deviceID VARCHAR(20),
	PRIMARY KEY(appID)
);

CREATE TABLE ALLERGENS(
	description VARCHAR(20) PRIMARY KEY NOT NULL
);

CREATE TABLE CLIENTS_TO_ALLERGIC(
	clientID SERIAL,
	allergen VARCHAR(20),
	FOREIGN KEY(clientID) REFERENCES CLIENT(appID),
	FOREIGN KEY(allergen) REFERENCES ALLERGENS(description)
);

CREATE TABLE CLIENTS_TO_INTOLERANCE(
	clientID SERIAL,
	allergen VARCHAR(20),
	FOREIGN KEY(clientID) REFERENCES CLIENT(appID),
	FOREIGN KEY(allergen) REFERENCES ALLERGENS(description)
);

INSERT INTO ALLERGENS(description) VALUES('lacteos');
INSERT INTO ALLERGENS(description) VALUES('gluten');
INSERT INTO ALLERGENS(description) VALUES('amendoins');
INSERT INTO ALLERGENS(description) VALUES('ovos');
INSERT INTO ALLERGENS(description) VALUES('marisco');
INSERT INTO ALLERGENS(description) VALUES('moluscos');
INSERT INTO ALLERGENS(description) VALUES('mostarda');
INSERT INTO ALLERGENS(description) VALUES('peixe');
INSERT INTO ALLERGENS(description) VALUES('sesamo');
INSERT INTO ALLERGENS(description) VALUES('soja');
INSERT INTO ALLERGENS(description) VALUES('tremocos');
INSERT INTO ALLERGENS(description) VALUES('so2');

