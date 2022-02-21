'use strict';

const router = require('express').Router();
const authMiddleware = require('../../../Globals/middlewares/auth')

const {  post, authenticate,findUser, authenticatevisitant, isAuthenticated } = require('./controller');

// Authenticate
router.post('/authenticate', authenticate);

// Authenticate Visitante
router.post('/authenticatevisitant', authenticatevisitant);

// findUser
router.post('/finduser', findUser);

//isAuthenticated
router.get('/isAuthenticated', isAuthenticated);

// // POST
router.post('/createUser', post);


module.exports = router;