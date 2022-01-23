const { errorLog, objectIsEmpty } = require('../../Globals/utils')
const { BADREQUEST, INTERNALSERVERERROR } = require('./../../Globals/httpErros')

const update = async (id, options = {}, Model) => {
    try {    
        const checkOptions = !objectIsEmpty(options);
        
        const validate = [ 
            id,
            Model,
            checkOptions,
            options.user,
        ]
        
        if (!validate.every(item => Boolean(item) === true)) {
            throw errorLog('Validation', BADREQUEST)
        }
        
        Object.assign(options, { updatedBy: options.user })

        const returnList = await Model.findByIdAndUpdate(id, options, { new: true });

        if (!returnList) return {}

        return returnList
    } catch (error) {        
        const msg = Boolean(error.status) ? error : INTERNALSERVERERROR
        return errorLog('post.catch'+error, msg)
    }
};

module.exports = update