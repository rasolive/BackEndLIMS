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
		required: true,
		select: false
	},
	role: {
		type: String,
		required: true,
	},
	createdBy: String,
	updatedBy: String,
}, {
	timestamps: true,
});

Users.pre("save", async function(next){
	const hash = await bcrypt.hash( this.password, 10);
	this.password = hash;
	next();
})

module.exports = mongoose.model('Users', Users, 'users');