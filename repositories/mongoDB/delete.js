const update = require('../../repositories/mongoDB/update')
const { handleReturnDB, errorLog, objectIsEmpty } = require('../../Globals/utils')
const { BADREQUEST, INTERNALSERVERERROR } = require('./../../Globals/httpErros')

const DBdelete = async (id, options = {}, Model) => {
try {
    const validate = [
        Model,
        !objectIsEmpty(options),
        options.user,
        id,
    ]

    if (!validate.every(item => Boolean(item) === true)) {
        throw BADREQUEST;
    }

    options = { active: false, user: options.user }

    const resultOfSearch = await update(id, options, Model)       
    return handleReturnDB(resultOfSearch)

    } catch(error) {
        return errorLog('post.catch'+error, Boolean(error.status) ? error : INTERNALSERVERERROR)

    }
}

module.exports = DBdelete
