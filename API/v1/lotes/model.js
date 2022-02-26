'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// const TableSchema = new Schema({ _id: Number, evidencia: String, fonte: String, detentor: String });

const Lotes = new Schema({
	_id: Number,
	active: Boolean,
	material: { type: Number, ref: "materiais" },
	lote: String,
	validade: Date,
	statusLote: Number,
	createdBy: String,
	updatedBy: String,
}, {
	timestamps: true,
});

module.exports = mongoose.model('Lotes', Lotes, 'lotes');
