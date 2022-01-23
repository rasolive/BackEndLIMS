'use strict';
require('dotenv').config()
module.exports = (err, req, res, next) => {

	if (process.env.NODE_ENV === 'DEV') {
		console.error(err);
	}

	res.status(err.status || 500);
	res.json({ message: err.message, extra: err.extra });
	res.end();
};