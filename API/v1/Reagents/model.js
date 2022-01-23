'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// const TableSchema = new Schema({ _id: Number, evidencia: String, fonte: String, detentor: String });

const Reagents = new Schema({
	_id: Number,
	active: Boolean,
	cod: Number,
	name: String,
	table: {type: Array, default: {} },
	specie_id: { type: Number, ref: "schema" },
    fields: { type: Object, default: {}},
	createdBy: String,
	updatedBy: String,
}, {
	timestamps: true,
});

module.exports = mongoose.model('Reagents', Reagents, 'reagents');
