require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Users} = require('../../../Models');
const { create, update, findById, findList, remove} = require('../../../repositories');
const { INTERNALSERVERERROR, BADREQUEST } = require('../../../Globals/httpErros');
const { errorLog } = require('../../../Globals/utils');

exports.findOne = async (req, res, next) => {
	
	const email = req.body.email || req.user.email;

		try{
					
			 const response = await Users.findOne({email})
			 return res.send(response);

		}catch(err){

			return res.status(400).send({error:'failed'});
			
		}

}

// POST
exports.post = async (req, res, next) => {

	const user = req.user.email;
	const email = req.body.email

		try{
			if (await Users.findOne({email})){
				return res.status(412).send({error:'User already exists'});}
				
			else{
			const response = await create(req.body, user, Users);
			 
			response.message.password =  undefined

			return res.send(response);}

		}catch(err){
			return res.status(400).send({error:'Registation failed'});
		}

}


// PUT
exports.put = async (req, res, next) => {

	const body = req.body
	body.user = req.user.email

	console.log('body', body)


	const returnList = await update(req.params.id, req.body, Users);

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

		const returnList = await findList({}, Users);

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

		const returnList = await findById(req.params.id, options, Users);
		
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

		Object.assign(req.body, {user: "Usuário de alteração"})
		const returnList = await remove(req.params.id, req.body, Users);

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