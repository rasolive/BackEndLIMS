'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// const TableSchema = new Schema({ _id: Number, evidencia: String, fonte: String, detentor: String });

const Specification = new Schema({
	_id: Number,
	active: Boolean,
	material: { type: Number, ref: "Materiais", required: true, unique: true },
	specification: { type: Array, default: {}, ref: "Analysis"},
	createdBy: String,
	updatedBy: String,
}, {
	timestamps: true,
});

module.exports = mongoose.model('Specification', Specification, 'specification');
