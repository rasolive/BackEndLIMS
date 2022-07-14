'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// const TableSchema = new Schema({ _id: Number, evidencia: String, fonte: String, detentor: String });

const Listas = new Schema({
	_id: Number,
	active: Boolean,
	name: {type: String, required: true, unique: true},
	lista: {type: Array, default: {} },
	createdBy: String,
	updatedBy: String,
}, {
	timestamps: true,
});

module.exports = mongoose.model('Listas', Listas, 'listas');
