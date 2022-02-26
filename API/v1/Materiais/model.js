'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// const TableSchema = new Schema({ _id: Number, evidencia: String, fonte: String, detentor: String });

const Materiais = new Schema({
	_id: Number,
	active: Boolean,
	codigo: Number,
	nome: String,
	armazenamento: Number,
	statusMaterial: Number,
	createdBy: String,
	updatedBy: String,
}, {
	timestamps: true,
});

module.exports = mongoose.model('Materiais', Materiais, 'materiais');
