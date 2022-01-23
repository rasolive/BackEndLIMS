'use strict';

const router = require('express').Router();

const { getList, getById, post, put, deleteById } = require('./controller');

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