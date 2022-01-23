const find = require('./find')
const { handleReturnDB } = require('../../Globals/utils')
const findList = async (options = {}, Model, populate = {}) => {      
    const resultOfSearch = await find(options, Model, populate)
    return handleReturnDB(resultOfSearch)
}

module.exports = findList