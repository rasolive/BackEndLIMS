require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Users} = require('../../../Models');
const { create, update, findById, findList, remove } = require('../../../repositories');
const { INTERNALSERVERERROR, BADREQUEST } = require('../../../Globals/httpErros');
const { errorLog } = require('../../../Globals/utils');

function generateToken(params={}){
	return jwt.sign(params, process.env.JWT_SECRET, {expiresIn: 3600});
}


exports.findUser = async (req, res, next) => {

	const {email} = req.body
	console.log("body", req.body)

	try{
		
		const usuario = await Users.findOne({email})

		return res.status(200).send({response:`usuário ${usuario.email} válido`})
			

	}catch(err){
		return res.status(400).send({error:'User not Found'});
	}

}


// POST
exports.post = async (req, res, next) => {

		const {user, email} = req.body
		console.log("body", req.body)

		try{
			if (await Users.findOne({email}))
				return res.status(400).send({error:'User already exists'});
		
			const response = await create(req.body, user, Users);
			 
			response.message.password =  undefined

			return res.send({response,
				token: generateToken({id: response.message._id, name: response.message.name, email: response.message.email, role: response.message.role })});

		}catch(err){
			return res.status(400).send({error:'Registation failed'});
		}

}

exports.authenticate = async (req, res, next) => {

	const {email, password} = req.body

	const user = await Users.findOne({email}).select('+password')
	console.log(user)
	if (!user)
		return res.status(400).send({error: 'User not foud'})

	if (!await bcrypt.compare(password, user.password))
		return res.status(400).send({error: 'invalid password'})

	user.password =  undefined


	res.send({user, 
		token: generateToken({id: user._id, name: user.name, email: user.email, role: user.role}) });

}

// PUT
exports.put = async (req, res, next) => {


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

		const returnList = await findById(req.params.id, options, User);
		
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
		const returnList = await remove(req.params.id, req.body, User);

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