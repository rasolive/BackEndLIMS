require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Users } = require('../../../Models');
const { create, update, findById, findList, remove } = require('../../../repositories');
const { INTERNALSERVERERROR, BADREQUEST } = require('../../../Globals/httpErros');
const { errorLog } = require('../../../Globals/utils');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function generateToken(params = {}) {
	return jwt.sign(params, process.env.JWT_SECRET, { expiresIn: 3600 * 5 });
}


exports.findUser = async (req, res, next) => {

	const { email } = req.body

	try {

		const usuario = await Users.findOne({ email })

		return res.status(200).send({ response: `usuário ${usuario.email} válido` })


	} catch (err) {
		return res.status(400).send({ error: 'User not Found' });
	}

}

exports.findOne = async (req, res, next) => {

	const email = req.body.email

	try {

		const response = await Users.findOne({ email })
		return res.send(response);

	} catch (err) {

		return res.status(400).send({ error: 'failed' });

	}

}


// POST
exports.createUser = async (req, res, next) => {


	const email = req.body.email

	const body = req.body

	body.role = [{ id: "4zlemf88g", perfil: "V" }]

	try {
		if (await Users.findOne({ email })) {
			return res.status(412).send({ error: 'User already exists' });
		}

		else {

			const response = await create(body, email, Users);

			response.message.password = undefined

			return res.send(response);
		}

	} catch (err) {
		return res.status(400).send({ error: 'Registation failed' });
	}


}
// POST
exports.createGoogleUser = async (req, res, next) => {


	const email = req.body.email

	const body = req.body

	body.validPass = true

	body.role = [{ id: "4zlemf88g", perfil: "V" }]

	try {
		if (await Users.findOne({ email })) {
			return res.status(412).send({ error: 'User already exists' });
		}

		else {

			const response = await create(body, email, Users);

			return res.send(response);
		}

	} catch (err) {
		return res.status(400).send({ error: 'Registation failed' });
	}


}

exports.authenticate = async (req, res, next) => {

	const { email, password } = req.body

	const user = await Users.findOne({ email }).select('+password')

	if (!user)
		return res.status(400).send({ error: 'User not foud' })

	if (!await bcrypt.compare(password, user.password))
		return res.status(401).send({ error: 'invalid password' })

	user.password = undefined


	res.send({
		user,
		token: generateToken({ id: user._id, name: user.name, email: user.email, role: user.role.map((node) => node.perfil), validPass: user.validPass })
	});

}

exports.authenticateGoogleUser = async (req, res, next) => {


	const { tokenId } = req.body

	async function verify() {
		const ticket = await client.verifyIdToken({
			idToken: tokenId,
			audience: process.env.GOOGLE_CLIENT_ID,
		});
		const payload = ticket.getPayload();


		if (payload.email_verified) {
			const email = payload.email;
			const user = await Users.findOne({ email })
			if (user) {

				return res.send({ token: generateToken({ id: user._id, name: user.name, email: user.email, role: user.role.map((node) => node.perfil), validPass: user.validPass }) });

			} else {

				const body = {
					name: payload.name,
					email: payload.email,
					password: "",
					validPass: true,
					role: [{ id: "4zlemf88g", perfil: "V" }]
				}

				const response = await create(body, payload.email, Users);

				response.message.password = undefined

				return res.send({ token: generateToken({ id: response.message._id, name: response.message.name, email: response.message.email, role: response.message.role.map((node) => node.perfil), validPass: response.message.validPass }) });
			}
		}

	}
	verify().catch(console.error);

	// const user = await Users.findOne({email})

	// res.send({token: generateToken({id: user._id, name: user.name, email: user.email, role: user.role.map((node) => node.perfil), validPass: user.validPass}) });

}

//isAuthenticated
exports.isAuthenticated = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader)
		return res.status(200).send({ "isAuthenticated": "false" });


	token = authHeader

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) return res.status(200).send({ "isAuthenticated": "false" })

		req.user = decoded;

		res.send({
			"isAuthenticated": "true",
			"validPass": `${req.user.validPass}`
		});
	})



}

