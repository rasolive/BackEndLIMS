'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// const TableSchema = new Schema({ _id: Number, evidencia: String, fonte: String, detentor: String });

const Materiais = new Schema({
	_id: Number,
	active: Boolean,
	cod: Number,
	name: String,
	armazenamento: {type: String, ref: "listas"},
	statusMaterial: {type: String, ref: "listas"},
	fornecedor:{type: Array, default: {}, ref: "fornecedores"},
	umb: {type: String, ref: "listas"},
	createdBy: String,
	updatedBy: String,
}, {
	timestamps: true,
});

module.exports = mongoose.model('Materiais', Materiais, 'materiais');
