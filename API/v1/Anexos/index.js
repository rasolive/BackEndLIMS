'use strict';

const router = require('express').Router();

require('dotenv').config()

const { download } = require('./download');


router.get('/download', download);


module.exports = router;
