const Materiais = require('../API/v1/Materiais/model');
const Reagents = require('../API/v1/Reagents/model');
const Lotes = require('../API/v1/lotes/model');
const Users = require('../API/v1/Users/model');
const Listas = require('../API/v1/Listas/model');
const Fornecedores = require('../API/v1/Fornecedores/model');
const Analysis = require('../API/v1/Analysis/model');
const AnalysisMethod = require('../API/v1/AnalysisMethod/model');

const models = {
    Reagents,
    Lotes,
    Users,
    Materiais,
    Listas,
    Fornecedores,
    Analysis,
    AnalysisMethod,
};

module.exports = models;