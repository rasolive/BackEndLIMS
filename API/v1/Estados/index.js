'use strict';

const router = require('express').Router();
const authMiddleware = require('../../../Globals/middlewares/auth')

const { getList, getById } = require('./controller');
//const { findOne } = require('./model');

router.use(authMiddleware)

// GET list
router.get('/', getList);

// // GET by ID
router.get('/:id', getById);


module.exports = router;