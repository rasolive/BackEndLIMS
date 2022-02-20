'use strict';

const router = require('express').Router();

const { getList, getById, post, put, deleteById, authenticate,findUser } = require('./controller');

// Authenticate
router.post('/authenticate', authenticate);

// findUser
router.post('/finduser', findUser);

// GET list
router.get('/', getList);

// // GET by ID
router.get('/:id', getById);

// // POST
router.post('/', post);

// // PUT
router.put('/:id', put);

// // DELETE
router.delete('/:id', deleteById);

module.exports = router;