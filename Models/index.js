const Materiais = require('../API/v1/Materiais/model');
const Lotes = require('../API/v1/lotes/model');
const Users = require('../API/v1/Users/model');
const Listas = require('../API/v1/Listas/model');
const Fornecedores = require('../API/v1/Fornecedores/model');
const Analysis = require('../API/v1/Analysis/model');
const AnalysisMethod = require('../API/v1/AnalysisMethod/model');
const Specification = require('../API/v1/Specification/model');
const Permissions = require('../API/v1/Permissions/model');
const Estados = require('../API/v1/Estados/model');
const Contato = require('../API/v1/Contato/model')

const models = {
    Lotes,
    Users,
    Materiais,
    Listas,
    Fornecedores,
    Analysis,
    AnalysisMethod,
    Specification,
    Permissions,
    Estados,
    Contato
};

module.exports = models;