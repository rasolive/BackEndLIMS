'use strict';

const router = require('express').Router();
const authMiddleware = require('../../../Globals/middlewares/auth')

const {  createUser, authenticate,findUser, authenticateGoogleUser, isAuthenticated, findOne } = require('./controller');

// Authenticate
router.post('/authenticate', authenticate);

// Authenticate Visitante
router.post('/authenticateGoogleUser', authenticateGoogleUser);

// findUser
router.post('/finduser', findUser);

//isAuthenticated
router.get('/isAuthenticated', isAuthenticated);

// // POST
router.post('/createUser', createUser);

// findOne
router.post('/findone', findOne);


module.exports = router;