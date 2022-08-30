'use strict';

const router = require('express').Router();
const authMiddleware = require('../../../Globals/middlewares/auth')

const { getList, getById, post, put, deleteById, getByMaterial, findOne } = require('./controller');

router.use(authMiddleware)

// FindOne
router.post('/findone', findOne);

// GET list
router.get('/', getList);

// // GET by ID
router.get('/:id', getById);
// // GET by ID
router.get('/material/:id', getByMaterial);

// // POST
router.post('/', post);

// // PUT
router.put('/:id', put);

// // DELETE
router.delete('/:id', deleteById);

module.exports = router;