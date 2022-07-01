const { Lotes } = require('../../../Models');
const { create, update, findById, findList, remove } = require('../../../repositories');
const { INTERNALSERVERERROR, BADREQUEST } = require('../../../Globals/httpErros');
const { errorLog } = require('../../../Globals/utils');

// POST
exports.post = async (req, res, next) => {

	const user = req.user.email;

	const lastRow = await Lotes.findOne().sort({ _id: -1 });
	const lote = lastRow ? 'LM'+(lastRow._id + 1000001) : 1000001;
	req.body.lote = lote;

	const result = await create(req.body, user, Lotes);

	if (result.status >= 400) {
		throw errorLog("Não foi possivel criar", INTERNALSERVERERROR);
	}

	if (result && result.message._id) {
		return res.json(result).end();
	} else {
		throw errorLog("Não foi possivel criar", INTERNALSERVERERROR);
	}
}

// PUT
exports.put = async (req, res, next) => {

const body = req.body

body.user = req.user.email

const returnList = await update(req.params.id, body, Lotes);

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

	const returnList = await findList({}, Lotes, [{path:'material', select:['name']}, {path:'fornecedor', select:['name']}]);

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

	const returnList = await findById(req.params.id, options, Lotes);
	
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
	
	const body = req.body

	body.user = req.user.email

	const returnList = await remove(req.params.id, body, Lotes);

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