const db = require('./global')

const getMany = (filter) => {
    return db('invites').where(filter)
}

module.exports = {
    getMany
}