'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// const TableSchema = new Schema({ _id: Number, evidencia: String, fonte: String, detentor: String });

const Materiais = new Schema({
	_id: Number,
	active: Boolean,
	cod: {type: String, required: true, unique: true},
	name: {type:String, required:true},
	armazenamento: {type: String, ref: "listas", required:true},
	statusMaterial: {type: String, ref: "listas", required:true},
	fornecedor:{type: Array, default: {}, ref: "fornecedores"},
	umb: {type: String, ref: "listas", required:true},
	createdBy: String,
	updatedBy: String,
}, {
	timestamps: true,
});

module.exports = mongoose.model('Materiais', Materiais, 'materiais');
