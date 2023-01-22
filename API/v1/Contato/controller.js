const { Contato } = require('../../../Models');
const nodemailer = require('nodemailer');
const { create, findById, findList, remove } = require('../../../repositories');
const { INTERNALSERVERERROR, BADREQUEST } = require('../../../Globals/httpErros');
const { errorLog } = require('../../../Globals/utils');
const { text } = require('body-parser');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.GMAIL,
		pass: process.env.GMAIL_PASS
	}
});

// POST
exports.post = async (req, res, next) => {

	const mailOptions = {
		from: process.env.GMAIL,
		to: 'rasolive@hotmail.com',
		subject: 'Formulário de contato applims.net',
		html: `<p>${req.body.msg}<br></br>
			enviado por: ${req.body.name}
			<br></br>
			E-mail: ${req.body.email}
		</p>`
	};

	const user = "Formulário de contato"

	const result = await create(req.body, user, Contato);

	if (result.status >= 400) {
		throw errorLog("Não foi possivel criar", INTERNALSERVERERROR);
	}

	if (result && result.message._id) {

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
				throw errorLog("Não foi possivel criar", INTERNALSERVERERROR);

			} else {
				console.log('Email sent: ' + info.response);
				return res.json(result).end();
				// do something useful
			}

		});
	} else {

	}
}

// GET list
exports.getList = async (req, res, next) => {
	try {
		//const { tokenUser } = res.session;

		const returnList = await findList({}, Contato);

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

		const returnList = await findById(req.params.id, options, Contato);

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

		const validate = [req.params.id];

		if (!validate.every(item => Boolean(item) === true)) {
			throw BADREQUEST;
		}

		const body = req.body

		body.user = req.user.email

		const returnList = await remove(req.params.id, body, Contato);

		if (returnList) {
			return res.json({ success: true }).end();
		} else {
			next(NOTFOUND);
		}
	} catch (error) {
		return (
			next(errorLog("delete.catch " + error, (error && error.status) ? error : INTERNALSERVERERROR))
		)
	}
}