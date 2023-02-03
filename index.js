'use strict';

// Dependencies
const path = require('path');
const https = require('https');
const cors = require('cors');
const express = require('express');
const database = require('./database');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerNode = require('./swaggerNode.json')
const swaggerPython = require('./swaggerPython.json')
//const compression = require('compression');
require('dotenv').config()

// Constants
const PORT = process.env.PORT || 8089;
const HOST = process.env.APP_HOST || 'unknown_host';
const REQ_SIZE_LIMIT = process.env.APP_REQ_SIZE_LIMIT || '1mb';

// Main app
const app = express();

// Certificate
//const rootCas = require('ssl-root-cas').create();
//rootCas.addFile(certificate);
//https.globalAgent.options.ca = rootCas;

// Middlewares
const API_v1 = require('./API/v1');
const health = require('./Globals/health');
const notFound = require('./Globals/notFound.js');
const errorHandler = require('./Globals/errorHandler');
//const ensureAuthenticated = require('./Middlewares/ensureAuthenticated');
const seeds = require('./Globals/seeds');
//const { showAllBaseUrls } = require('./Globals/axiosConfig');

app.use(cors());
//app.use(compression());
app.use(bodyParser.json({ limit: REQ_SIZE_LIMIT }));
app.use(bodyParser.urlencoded({ extended: true, limit: REQ_SIZE_LIMIT }));

// Handlers
app.use('/health', health); // global health reporter for k8s
app.use('/v1', API_v1); // main API v1

var options = {}
app.use('/swaggerNode', swaggerUi.serveFiles(swaggerNode, options), swaggerUi.setup(swaggerNode));
app.use('/swaggerPython', swaggerUi.serveFiles(swaggerPython, options), swaggerUi.setup(swaggerPython));

app.use(errorHandler); // global error handler, fallbacks to 500
app.use(notFound); // fallback to 404

// Start HTTP request listening
app.listen(PORT, async (err) => {
	try {

		if (err) {
			throw new Error(`\n${err}`)
		}

		if (!Boolean(process.env.AUTH_TOKEN)) {
			throw new Error(`Env. var. 'AUTH_TOKEN' is required.`);
		}

		//await showAllBaseUrls(true)
		await database.connect();
		console.log(`► app is listening at http://${HOST}:${PORT}`);
		console.log(process.platform)	
		await seeds.createAllSeeds();

	} catch(err) {
		console.error(err);
		process.exit(1);
	}
});