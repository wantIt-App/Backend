const db = require('./global')

const getMany = (filter) => {
    return db('invites').where(filter)
}

modules.exports = {
    getMany
}