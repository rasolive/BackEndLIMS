'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// const TableSchema = new Schema({ _id: Number, evidencia: String, fonte: String, detentor: String });

const Permissions = new Schema({
	_id: Number,
	active: Boolean,
	component: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	role: {
		type: Array, default: {}
	},
	createdBy: String,
	updatedBy: String,
}, {
	timestamps: true,
});


module.exports = mongoose.model('Permissions', Permissions, 'permissions');
