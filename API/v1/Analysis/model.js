'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// const TableSchema = new Schema({ _id: Number, evidencia: String, fonte: String, detentor: String });

const Analysis = new Schema({
	_id: Number,
	active: Boolean,
	AnalysisType: String,
	name: String,
	AnalysisMethod: String,
	unit: {type: String, ref: "listas"},
	createdBy: String,
	updatedBy: String,
}, {
	timestamps: true,
});

module.exports = mongoose.model('Analysis', Analysis, 'analysis');
