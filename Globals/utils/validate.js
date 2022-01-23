const { objectIsEmpty } = require('./../utils')
const validate = async (validate = {}, errorOptions = {}) => {
    const errors = [];

    const validated  = objectIsEmpty(validate)
    if (!validated) throw [`'validate' Object is required`]
  

    const errorsMsg = (key, options) => ({
        exemplo: 'msg do exemplo',
        ...options
    })[key] || `${key} is required`;

    Object.entries(validate)
        .forEach( ([key, value]) => {
            if (!Boolean(value)) {
                const msg = errorsMsg(key, errorOptions)
                errors.push(`${msg}`)
            }
        });
    
    if (!Boolean(errors.length)) {
        return Promise.reject(errorLog(`Erros de validação: \n→${errors}`, errors))
    }
    return Promise.resolve(true)
}

module.exports = validate