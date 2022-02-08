const DBcreate = require('./mongoDB/create')
const DBfind = require('./mongoDB/find')
const DBfindOne = require('./mongoDB/findOne')
const DBfindById = require('./mongoDB/findById')
const DBfindList = require('./mongoDB/findList')
const DBupdate = require('./mongoDB/update')
const DBdelete = require('./mongoDB/delete')


const repositorie = Object.assign({}, {
    create: DBcreate,
    find: DBfind,
    findOne: DBfindOne,
    findById: DBfindById,
    findList: DBfindList,
    update: DBupdate,
    remove: DBdelete
})

module.exports = repositorie