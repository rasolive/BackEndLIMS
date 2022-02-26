'use strict';

const router = require('express').Router();

router.use('/health', require('../../Globals/health'));
router.use('/materiais', require('./Materiais'));
router.use('/reagents', require('./Reagents'));
router.use('/anexos', require('./Anexos'));
router.use('/lotes', require('./lotes'));
router.use('/auth', require('./Auth'));
router.use('/users', require('./Users'));

module.exports = router;
