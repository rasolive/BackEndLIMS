'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// const TableSchema = new Schema({ _id: Number, evidencia: String, fonte: String, detentor: String });

const Contato = new Schema({
	_id: Number,
	active: Boolean,
	name: {type:String, required:true},
	email: {type:String, required:true},
	msg: {type:String, required:true},	
	createdBy: String
}, {
	timestamps: true,
});

module.exports = mongoose.model('Contato', Contato, 'contato');
