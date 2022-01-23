const { errorLog, objectIsEmpty } = require('../../Globals/utils')
const { BADREQUEST, INTERNALSERVERERROR } = require('./../../Globals/httpErros')

const find = async (options = {}, Model, populate = {}) => {
    try {

        const validate = [
            Model,
        ]

        if (!validate.every(item => Boolean(item) === true)) {
            throw errorLog('Validation', BADREQUEST)
        }

        const projection = options.projection ? options.projection : {};
        delete options.projection;

        const query = {
            active: true,
            ...options
        }

        if (!objectIsEmpty(populate)) {
            const returnList = await Model.find(query, projection)
                .populate(populate)
                .lean();
            return returnList ? returnList : [];
        }

        const returnList = await Model.find(query, projection)
            .lean();
        return returnList ? returnList : [];

    } catch (error) {
        return (
            errorLog('find.catch ' + error, Boolean(error.status) ? error : INTERNALSERVERERROR)
        )
    }
};

module.exports = find