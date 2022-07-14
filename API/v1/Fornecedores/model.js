'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// const TableSchema = new Schema({ _id: Number, evidencia: String, fonte: String, detentor: String });

const Suppliers = new Schema({
	_id: Number,
	active: Boolean,
	name: {type: String, required: true},
	rua: String,
	numero: String,
	bairro: String,
	cidade: String,
	estado: String,
	cep: String,
	telefone: String,
	email: String,
	//telefone: {type: Array, default: {} },
	cnpj: {type: String, required: true, unique: true},
	createdBy: String,
	updatedBy: String,
}, {
	timestamps: true,
});

module.exports = mongoose.model('Suppliers', Suppliers, 'suppliers');
