'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// const TableSchema = new Schema({ _id: Number, evidencia: String, fonte: String, detentor: String });

const AnalysisMethod = new Schema({
	_id: Number,
	active: Boolean,
	name: String,
	description: String,
	rev: Number,
	process: String,
	ref: String,	
	createdBy: String,
	updatedBy: String,
}, {
	timestamps: true,
});

module.exports = mongoose.model('AnalysisMethod', AnalysisMethod, 'analysisMethod');
