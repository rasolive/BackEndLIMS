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

    mensagem = `nova senha: '${newPass}'`


    const usuario = await Users.findOne({ email })

    console.log(usuario)
    console.log('newPass',newPass)
    console.log('body',body)

    if (usuario) {

        const response = await update(usuario._id, body, Users);

        console.log('response', response)

        if(response._id === usuario._id){
            return res.status(200).send({ response: `senha alterada` })
        }
    }
    else{

    return res.status(402).send({ response: `usuário ${email} não encontrado` })
}

};

// const mailOptions = {
//     from: process.env.GMAIL,
//     to: req.body.email,
//     subject: 'Redefinição de senha applims.net',
//     text: mensagem
// };

// transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//         console.log(error);
//         return res.json(INTERNALSERVERERROR).end()

//     } else {
//         console.log('Email sent: ' + info.response);
//         return res.json(SUCCESS).end()
//         // do something useful
//     }
// });