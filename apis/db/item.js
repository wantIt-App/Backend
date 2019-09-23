const db = require('./global')

const getMany = (filter) => {
    return db('items').where(filter)
}

const insert = (data) => {
    return db('items')
        .insert(data)
        .returning(['id', 'list_id', 'title', 'description', 'picture'])
        .then((data) => {
            return data[0]
        })
}

module.exports = {
    getMany,
    insert
}