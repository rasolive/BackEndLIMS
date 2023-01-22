'use strict';

const router = require('express').Router();
const authMiddleware = require('../../../Globals/middlewares/auth')

const { send, forgotPassword } = require('./controller');

// // POST
router.post('/', send);

router.post('/forgotPassword', forgotPassword);


module.exports = router;