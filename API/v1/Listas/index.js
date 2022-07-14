'use strict';

const router = require('express').Router();
const authMiddleware = require('../../../Globals/middlewares/auth')

const { getList, getById, post, put, deleteById, getListByName, findOne } = require('./controller');

router.use(authMiddleware)

// FindOne
router.post('/findone', findOne);
// GET list
router.get('/', getList);

// // GET by ID
router.get('/:id', getById);

// // GET by lista
router.post('/lista', getListByName);

// // POST
router.post('/', post);

// // PUT
router.put('/:id', put);

// // DELETE
router.delete('/:id', deleteById);

module.exports = router;