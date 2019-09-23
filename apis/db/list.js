const db = require('./global')

const getMany = (filter) => {
    let parsedLists
    return db('lists').where(filter)
        .then((data) => {
            parsedLists = data
            return Promise.all(data.map(list => db('users').where({id: list.owner_id}).returning('username')))
        })
        .then((data) => {
            return parsedLists.map((list,index) => ({
                ...list,
                owner_username: data[index]
            }))
        })
}

const getOne = (filter) => {
    let parsedList
    return db('lists').where(filter).first()
        .then((data) => {
            parsedList = data
            return db('users').where({id: parsedList.owner_id}).returning('username').first()
        })
        .then((data) => {
            return {
                ...parsedList,
                owner_username: data.username
            }
        })
}

const insert = (data) => {
    let parsedList
    return db('lists').insert(data).returning(['id', 'name', 'description', 'owner_id'])
        .then((data) => {
            parsedList = data[0]
            return db('users').where({id:parsedList.owner_id}).returning('username').first()
        })
        .then((data) => {
            return {
                ...parsedList,
                owner_username: data.username
            }
        })
}

module.exports = {
    insert,
    getMany,
    getOne
}