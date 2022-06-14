'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// const TableSchema = new Schema({ _id: Number, evidencia: String, fonte: String, detentor: String });

const Lotes = new Schema({
	_id: Number,
	active: Boolean,
	material: { type: Number, ref: "Materiais" },
	fornecedor: { type: Number, ref: "Suppliers" },
	lote: String,
	loteFornecedor: String,
	qtdInicial: Number,
	qtdAtual: Number,
	unidade: String,
	validade: String,
	statusLote: {type: String, ref: "Listas"},
	createdBy: String,
	updatedBy: String,
}, {
	timestamps: true,
});

module.exports = mongoose.model('Lotes', Lotes, 'lotes');
