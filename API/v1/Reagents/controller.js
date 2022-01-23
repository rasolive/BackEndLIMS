const { Reagents} = require('../../../Models');
const { create, update, findById, findList, remove } = require('../../../repositories');
const { INTERNALSERVERERROR, BADREQUEST } = require('../../../Globals/httpErros');
const { errorLog } = require('../../../Globals/utils');

// POST
exports.post = async (req, res, next) => {
	// try {
	// 	const validate = [ res.session.user ];
	// 	if (!validate.every(item => Boolean(item) === true)) {
	// 		throw BADREQUEST;
	// 	}

		const user = "ricardo";


		const result = await create(req.body, user, Reagents);

		if (result.status >= 400) {
			throw errorLog("Não foi possivel criar", INTERNALSERVERERROR);
		}

		if (result && result.message._id) {
			return res.json(result).end();
		} else {
			throw errorLog("Não foi possivel criar", INTERNALSERVERERROR);
		}

	// } catch (error) {
	// 	return (
	// 		next(errorLog("post.catch", (error && error.status) ? error : INTERNALSERVERERROR))
	// 	)
	// }
}

// PUT
exports.put = async (req, res, next) => {

	// const validate = [ res.session.user ];
	// if (!validate.every(item => Boolean(item) === true)) {
	// 	throw BADREQUEST;
	// }

	Object.assign(req.body, { user: "Ricardo" })

	const returnList = await update(req.params.id, req.body, Reagents);

	try {
		if (returnList) {
			return res.json({ _id: req.params.id, success: true }).end();
		} else {
			throw errorLog("Não foi possivel atualizar", NOTFOUND);
		}
	} catch (error) {
		return (
			next(errorLog("put.catch "+error, (error && error.status) ? error : INTERNALSERVERERROR))
		)
	}
}

// GET list
exports.getList = async (req, res, next) => {
    try {
		//const { tokenUser } = res.session;

		const returnList = await findList({}, Reagents);

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
		
        const validate = [ req.params.id ];

		if (!validate.every(item => Boolean(item) === true)) {
			throw BADREQUEST;
		}
        
        const options = {}
		Object.assign(options, { active: true })
		Object.assign(options, req.query || {})
		delete options.token;        

		const returnList = await findById(req.params.id, options, Reagents);
		
        if (!returnList) return res.json({}).end();

		return res.json(returnList).end();

	} catch (error) {
		return (
			next(errorLog("getById.catch", (error && error.status) ? error : INTERNALSERVERERROR))
		)
	}
}


// DELETE
exports.deleteById = async (req, res, next) => {
	try {

		const validate = [ req.params.id ];

		if (!validate.every(item => Boolean(item) === true)) {
			throw BADREQUEST;
		}

		Object.assign(req.body, { user: "Ricardo" })

		const returnList = await remove(req.params.id, req.body, Reagents);

		if (returnList) {
			return res.json({ success: true }).end();
		} else {
			next(NOTFOUND);
		}
	} catch (error) {
		return (
			next(errorLog("delete.catch "+error, (error && error.status) ? error : INTERNALSERVERERROR))
		)
	}
}