'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// const TableSchema = new Schema({ _id: Number, evidencia: String, fonte: String, detentor: String });

const Analysis = new Schema({
	_id: Number,
	id:Number, //id necessário para o frontend rodar o script da tabela de especificações
	active: Boolean,
	AnalysisType: String,
	name: String,
	AnalysisMethod: {type: String, ref: "AnalysisMethod"},
	unit: {type: String, ref: "listas"},
	createdBy: String,
	updatedBy: String,
}, {
	timestamps: true,
});

Analysis.pre("save", async function(next){
	this.id= this._id;
	next();
})

module.exports = mongoose.model('Analysis', Analysis, 'analysis');
