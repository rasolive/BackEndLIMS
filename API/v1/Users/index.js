'use strict';

const router = require('express').Router();
const authMiddleware = require('../../../Globals/middlewares/auth')

const { getList, getById, post, put, deleteById, findOne } = require('./controller');
//const { findOne } = require('./model');

router.use(authMiddleware)

// GET list
router.get('/', getList);

// // GET by ID
router.get('/:id', getById);

// // POST
router.post('/findOne', findOne);

// // POST
router.post('/', post);

// // PUT
router.put('/:id', put);

// // DELETE
router.delete('/:id', deleteById);

module.exports = router;