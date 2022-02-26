const Materiais = require('../API/v1/Materiais/model');
const Reagents = require('../API/v1/Reagents/model');
const Lotes = require('../API/v1/lotes/model');
const Users = require('../API/v1/Users/model');

const models = {
    Reagents,
    Lotes,
    Users,
    Materiais,
};

module.exports = models;