const { errorLog, objectIsEmpty } = require('../../Globals/utils')
const { BADREQUEST, INTERNALSERVERERROR, SUCCESS } = require('../../Globals/httpErros')

 /**@todo criar recursividade caso não cadastre!  */

const create = async (options = {}, User, Model) => {
    try {
        const checkOptions = !objectIsEmpty(options);

        const validate = [ 
            checkOptions,
            User,
            Model,
         ]

        if (!validate.every(item => Boolean(item) === true)) {
            throw errorLog('Validate are failed', BADREQUEST);
        }
        
        const lastRow = await Model.findOne().sort({ _id: -1 });
        const _id = lastRow ? lastRow._id + 1 : 1;
        
        Object.assign(options, { createdBy: User })

        const collection = new Model({
            _id,
            active: true,
            ...options,
        });
        
        const result = await collection.save();
        
        if (result && result._id) {
            return { status: SUCCESS.status, message: result } ;
        } else {
            throw errorLog('result _id is missing', INTERNALSERVERERROR);
        }
    } catch(error) {
        /**@todo: criar recursividade em caso de erro */
        return errorLog('post.catch'+error, Boolean(error.status) ? error : INTERNALSERVERERROR)
    }
}

module.exports = create