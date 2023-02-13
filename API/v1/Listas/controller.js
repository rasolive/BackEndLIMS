const { Listas } = require('../../../Models');
const { create, update, findById, findList, remove} = require('../../../repositories');
const { INTERNALSERVERERROR, BADREQUEST } = require('../../../Globals/httpErros');
const { errorLog } = require('../../../Globals/utils');

// POST

exports.findOne = async (req, res, next) => {
	
	const name = req.body.name || ''

		try{
					
			 const response = await Listas.findOne({'name': name})
			 return res.send(response);

		}catch(err){

			return res.status(400).send({error:'failed'});
			
		}

}


exports.post = async (req, res, next) => {

		const user = req.user.email;
		const name = req.body.name

		try {
			if (await Listas.findOne({'name': name})) {
				return res.status(412).send({ error: 'List already exists' });
			}
	
			else {
				const result = await create(req.body, user, Listas);
	
				return res.json(result).end();
			}
	
		} catch (err) {
			return res.status(400).send({ error: 'Registation failed' });
		}
}

// PUT
exports.put = async (req, res, next) => {
	
	const body = req.body

    body.user = req.user.email
	body.name = undefined

	const returnList = await update(req.params.id, body, Listas);

	try {
		if (returnList) {
			return res.json(returnList).end();
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

		const returnList = await findList({}, Listas);

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

		const returnList = await findById(req.params.id, options, Listas);
		
        if (!returnList) return res.json({}).end();

		return res.json(returnList).end();

	} catch (error) {
		return (
			next(errorLog("getById.catch", (error && error.status) ? error : INTERNALSERVERERROR))
		)
	}
}

// GET by Lista by Name
exports.getListByName = async (req, res, next) => {
    try {
		//const { tokenUser } = res.session;

		const returnList = await findList(req.body, Listas);

		return res.json(returnList).end();

	} catch (error) {
		return (
			next(errorLog("getList.catch ", (error && error.status) ? error : INTERNALSERVERERROR))
		)
	}
};

// DELETE
exports.deleteById = async (req, res, next) => {
	try {

		const validate = [ req.params.id ];

		if (!validate.every(item => Boolean(item) === true)) {
			throw BADREQUEST;
		}
		
		const body = req.body

    	body.user = req.user.email

		const returnList = await remove(req.params.id, body, Listas);

		if (returnList) {
			return res.json(returnList).end();
		} else {
			next(NOTFOUND);
		}
	} catch (error) {
		return (
			next(errorLog("delete.catch "+error, (error && error.status) ? error : INTERNALSERVERERROR))
		)
	}
}