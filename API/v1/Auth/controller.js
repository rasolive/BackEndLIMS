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
		
			const response = await create(req.body, email, Users);
			 
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

exports.authenticatevisitant = async (req, res, next) => {

	const {email, name, role} = req.body

	
	res.send({token: generateToken({name: name, email: email, role: role}) });

}

//isAuthenticated
exports.isAuthenticated = async (req, res, next) => {
	const authHeader = req.headers.authorization;

    if(!authHeader)
        return res.status(200).send({ "isAuthenticated": "false"});

    
    token = authHeader

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
       if (err) return res.status(200).send({ "isAuthenticated": "false"})

       req.user = decoded;

       res.send({"isAuthenticated": "true"});
    } )

		

}
