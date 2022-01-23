const findOne = require('../../repositories/mongoDB/findOne')
const { errorLog } = require('../../Globals/utils')
const { BADREQUEST, INTERNALSERVERERROR } = require('./../../Globals/httpErros')

const findById = async (id, options = {}, Model, populate = {}) => {
    try {               
        const validate = [
            id,
            Model,
        ]

        if (!validate.every(item => Boolean(item) === true)) {
            throw errorLog('Validate are failed', BADREQUEST);
        }

        Object.assign(options, { _id: id })
        const result = await findOne(options, Model, populate)
        
        return result ? result : {}

    } catch (error) {
        return (
            errorLog('find.catch '+error, Boolean(error.status) ? error : INTERNALSERVERERROR)
        )
    }
};

module.exports = findById