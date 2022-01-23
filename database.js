'use strict';

const mongoose = require('mongoose');

async function connect() {

	const connString = process.env.CONN_STRING;

	if (!connString || connString.length < 1) {
		throw new Error(`Env. var. 'CONN_STRING' is required.`);
	}

	await mongoose.connect(connString, {
		dbName: process.env.MONGODB_SCHEMA,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
}


module.exports = { connect };