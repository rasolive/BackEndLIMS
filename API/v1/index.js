'use strict';

const router = require('express').Router();

router.use('/health', require('../../Globals/health'));
router.use('/materiais', require('./Materiais'));
router.use('/listas', require('./Listas'));
router.use('/anexos', require('./Anexos'));
router.use('/lotes', require('./lotes'));
router.use('/auth', require('./Auth'));
router.use('/users', require('./Users'));
router.use('/fornecedores', require('./Fornecedores'));
router.use('/analysis', require('./Analysis'));
router.use('/analysismethod', require('./AnalysisMethod'));
router.use('/specification', require('./Specification'));
router.use('/permissions', require('./Permissions'));

module.exports = router;
