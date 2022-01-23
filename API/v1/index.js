'use strict';

const router = require('express').Router();


router.use('/reagents', require('./Reagents'));

module.exports = router;
