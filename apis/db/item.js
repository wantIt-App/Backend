const db = require('./global')

const getMany = (filter) => {
    return db('items').where(filter)
}

const insert = (data) => {
    return db('items').insert(data).returning(['id', 'list_id', 'title', 'description', 'picture'])
}

module.exports = {
    getMany,
    insert
}