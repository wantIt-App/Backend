const db = require('./global')

const getOne = (filter) => {
    return db('invites').where(filter).first()
}

const getMany = (filter) => {
    return db('invites').where(filter)
}

const insert = (data) => {
    return db('invites').insert(data).returning(["list_id", "invitee_id", "rejected"])
}

const update = (filter, data) => {
    return db('invites').where(filter).update(data).returning(["list_id", "invitee_id", "rejected"])
}

module.exports = {
    getOne,
    getMany,
    insert,
    update
}