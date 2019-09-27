const db = require('./global')

const getMany = (filter) => {
    return db('invites').where(filter)
}

const insert = (data) => {
    return db('invites').insert(data)
}

const update = (filter, data) => {
    return db('invites').where(filter).update(data)
}

module.exports = {
    getMany,
    insert,
    update
}