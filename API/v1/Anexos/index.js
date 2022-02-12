'use strict';
require('dotenv').config()
const router = require('express').Router();
var multer = require('multer');
var upload = multer();




const { post } = require('./upload');
const { download } = require('./download');


router.get('/download', download);

router.post(
    '/upload',
    upload.array('files'), //'file', process.env.GCP_UPLOAD_MAX_FILE_COUNT || Infinity),
    post
    );


module.exports = router;
