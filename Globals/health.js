'use strict';

module.exports = (req, res, next) => {
	res.status(200);
	res.json({ healthy: true });
	res.end();
};