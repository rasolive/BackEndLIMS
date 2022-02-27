'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// const TableSchema = new Schema({ _id: Number, evidencia: String, fonte: String, detentor: String });

const Fornecedores = new Schema({
	_id: Number,
	active: Boolean,
	nome: String,
	endereco: {type: Array, default: {} },
	telefone: {type: Array, default: {} },
	cnpj: String,
	createdBy: String,
	updatedBy: String,
}, {
	timestamps: true,
});

module.exports = mongoose.model('Fornecedores', Fornecedores, 'fornecedores');
