'use strict';

const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
const { Schema } = mongoose;

// const TableSchema = new Schema({ _id: Number, evidencia: String, fonte: String, detentor: String });

const Estados = new Schema({
	_id: Number,
	active: Boolean,
	Sigla: {
		type: String,
	},
	Estado: {
		type: String,
	},
	Longitude: {
		type: Number,
	},
	Latitude: {
		type: Number
	},
	createdBy: String,
	updatedBy: String,
}, {
	timestamps: true,
});


module.exports = mongoose.model('Estados', Estados, 'estados');
