const { Storage } = require('@google-cloud/storage');
const { WorkflowArchive } = require('./model')
const { makeTreeUri } = require('./tree')
const moment = require('moment')

/**@todo: create route and search for Equipaments with axios in general-config-db */
/**@todo: implement search with axios and remove model 'Equipaments' */
const Project = require('../Projects/model')
const Equipaments = require('../Equipments/model')

require('dotenv').config()

var multer = require('multer');
var upload = multer();

const storage = new Storage({
	projectId: process.env.GCP_PROJECT_ID || '',
    credentials: JSON.parse(process.env.GCP_CONFIG_PATH),
});

const uploadFile = async (filename, bucketName = process.env.GCP_BUCKET_NAME) => {

	return await storage.bucket(bucketName).upload(filename, { 
		destination: `${process.env.GCP_BUCKET_PATH}${filename}`,
		gzip: true,
	});
}

