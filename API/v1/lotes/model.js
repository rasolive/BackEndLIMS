'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// const TableSchema = new Schema({ _id: Number, evidencia: String, fonte: String, detentor: String });

const Lotes = new Schema({
	_id: Number,
	active: Boolean,
	material: { type: Number, ref: "Materiais", required: true },
	fornecedor: { type: Number, ref: "Suppliers", required: true },
	lote: {type:String, required:true, unique: true},
	loteFornecedor: {type:String, required:true},
	qtdInicial: {type: Number, required:true},
	qtdAtual: Number,
	unidade: String,
	validade: {type:String, required:true},
	statusLote: {type: String, ref: "Listas"},
	analysisResult: { type: Array, default: {}},
	startedAnalysis: { type: Boolean, default: false },
	createdBy: String,
	updatedBy: String,
}, {
	timestamps: true,
});

module.exports = mongoose.model('Lotes', Lotes, 'lotes');
