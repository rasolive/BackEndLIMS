'use strict';

const router = require('express').Router();

router.use('/health', require('../../Globals/health'));

router.use('/reagents', require('./Reagents'));

module.exports = router;
