const db = require('./global')

const insert = (user) => {
    return db('users').insert(user).returning(['id', 'email', 'username'])
        .then((data) => {
            //You can't chain .first() onto an insert
            //We will only insert one user at a time
            //So select first index of returned array
            return data[0]
        })
}

const getOne = (filter) => {
    return db('users').where(filter).first()
}

module.exports = {
    insert,
    getOne
}