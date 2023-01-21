'use strict';

const router = require('express').Router();
const authMiddleware = require('../../../Globals/middlewares/auth')

const { getList, getById, post, put, deleteById } = require('./controller');

// // POST
router.post('/', post);

router.use(authMiddleware);
// GET list
router.get('/', getList);

// // GET by ID
router.get('/:id', getById);

// // DELETE
router.delete('/:id', deleteById);

module.exports = router;