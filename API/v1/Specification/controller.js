const { Specification } = require('../../../Models');
const { create, update, findById, findList, remove, findOne } = require('../../../repositories');
const { INTERNALSERVERERROR, BADREQUEST } = require('../../../Globals/httpErros');
const { errorLog } = require('../../../Globals/utils');

exports.findOne = async (req, res, next) => {
	
	const material = req.body.material || ''

		try{
					
			 const response = await Specification.findOne({'material': material})
			 return res.send(response);

		}catch(err){

			return res.status(400).send({error:'failed'});
			
		}

}

// POST
exports.post = async (req, res, next) => {

		const user = req.user.email;
		const material = req.body.material

		try {
			if (await Specification.findOne({'material': material})) {
				return res.status(412).send({ error: 'Specification already exists' });
			}
	
			else {
				const result = await create(req.body, user, Specification);
	
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
	body.material = undefined

	const returnList = await update(req.params.id, body, Specification);

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

		const returnList = await findList({}, Specification, {path:'material', select:['name']});

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

		const returnList = await findById(req.params.id, options, Specification);
		
        if (!returnList) return res.json({}).end();

		return res.json(returnList).end();

	} catch (error) {
		return (
			next(errorLog("getById.catch", (error && error.status) ? error : INTERNALSERVERERROR))
		)
	}
}

exports.getByMaterial = async (req, res, next) => {
	try {
		
        const validate = [ req.params.id ];

		if (!validate.every(item => Boolean(item) === true)) {
			throw BADREQUEST;
		}
        
        const options = {'material': req.params.id}
		Object.assign(options, { active: true })
		delete options.token;        

		const returnList = await findOne(options, Specification);
		
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

		const returnList = await remove(req.params.id, body, Specification);

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