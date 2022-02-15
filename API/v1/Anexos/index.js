'use strict';
require('dotenv').config()
const router = require('express').Router();
var multer = require('multer');
var upload = multer();




const { post } = require('./upload');
const { download } = require('./download');
const { list } = require('./List');
const { deleteFile } = require('./Delete')
router.post('/download', download);
router.post('/list', list);
router.post('/delete', deleteFile);

router.post(
    '/upload',
    upload.array('files'), //'file', process.env.GCP_UPLOAD_MAX_FILE_COUNT || Infinity),
    post
    );


module.exports = router;
