require('dotenv').config()
const { Estados } = require('../../../Models');
const { findById, findList} = require('../../../repositories');
const { INTERNALSERVERERROR, BADREQUEST } = require('../../../Globals/httpErros');
const { errorLog } = require('../../../Globals/utils');



// GET list
exports.getList = async (req, res, next) => {
	try {
		//const { tokenUser } = res.session;

		const returnList = await findList({}, Estados);

		return res.json(returnList).end();

	} catch (error) {
		return (
			next(errorLog("getList.catch ", (error && error.status) ? error : INTERNALSERVERERROR))
		)
	}
};

// GET by ID
exports.getById = async (req, res, next) => {
	try {

		const validate = [req.params.id];

		if (!validate.every(item => Boolean(item) === true)) {
			throw BADREQUEST;
		}

		const options = {}
		Object.assign(options, { active: true })
		Object.assign(options, req.query || {})
		delete options.token;

		const returnList = await findById(req.params.id, options, Estados);

		if (!returnList) return res.json({}).end();

		return res.json(returnList).end();

	} catch (error) {
		return (
			next(errorLog("getById.catch", (error && error.status) ? error : INTERNALSERVERERROR))
		)
	}
}


