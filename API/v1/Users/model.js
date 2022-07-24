'use strict';

const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
const { Schema } = mongoose;

// const TableSchema = new Schema({ _id: Number, evidencia: String, fonte: String, detentor: String });

const Users = new Schema({
	_id: Number,
	active: Boolean,
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true
	},
	password: {
		type: String,
		select: false
	},
	validPass: {
		type: Boolean,
	},
	role: {
		type: Array, default: {},
		required: true,
	},
	createdBy: String,
	updatedBy: String,
}, {
	timestamps: true,
});

Users.pre("save", async function(next){
	if(this.password){
	const hash = await bcrypt.hash( this.password, 10);
	this.password = hash;}
	next();
})

Users.pre('findOneAndUpdate', async function(next){
	if(this._update.password){
	const hash = await bcrypt.hash( this._update.password, 10);
	this._update.password = hash;}
	next();
})

module.exports = mongoose.model('Users', Users, 'users');
