const nodemailer = require('nodemailer');
require('dotenv').config()
const { Users } = require('../../../Models');
const { create, update, findById, findList, remove } = require('../../../repositories');
const { INTERNALSERVERERROR, BADREQUEST, SUCCESS } = require('../../../Globals/httpErros');
const { errorLog } = require('../../../Globals/utils');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASS
    }
});

function gerarPassword() {
    return Math.random().toString(36).slice(-15);
}


// GET list
exports.send = async (req, res, next) => {


    const mailOptions = {
        from: process.env.GMAIL,
        to: req.body.email,
        subject: req.body.subject,
        text: req.body.mensagem
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return res.json(INTERNALSERVERERROR).end()

        } else {
            console.log('Email sent: ' + info.response);
            return res.json(SUCCESS).end()
            // do something useful
        }
    });
};

exports.forgotPassword = async (req, res, next) => {

    const { email } = req.body
    body = req.body

    newPass = gerarPassword()
    body.password = newPass
    body.validPass = false
    body.user = 'System'

    mensagem = `<p>Olá,<br></br>
    &emsp; Você solicitou o reset de senha do sistema applims.net. Faça seu login no serviço
    com a nova senha informada abaixo e, em seguida, troque sua senha.
    <br></br>
    Senha: <strong>${newPass}</strong>
    <br></br>
    Em caso de problemas <a href="https://applims.herokuapp.com/contato">entre em contato com o administrador do sistema.</a>
    <br></br>
    E-mail enviado automáticamente pelo sistema, favor não responder.
    <br></br>
    Obrigado,
    <br></br>
    <a href="https://applims.herokuapp.com">applims.net</a>
</p>`


    const usuario = await Users.findOne({ email })

    if (usuario) {

        const response = await update(usuario._id, body, Users);

        if (response._id === usuario._id) {

            const mailOptions = {
                from: process.env.GMAIL,
                to: req.body.email,
                subject: 'Redefinição de senha applims.net',
                html: mensagem
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    return res.json(INTERNALSERVERERROR).end()

                } else {
                    console.log('Email sent: ' + info.response);
                    return res.json(SUCCESS).end()
                    // do something useful
                }
            });
        }
    }
    else {

        return res.status(400).send({ status: 400, response: `usuário ${email} não encontrado` })
    }

};



