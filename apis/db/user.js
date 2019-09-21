const db = require('./global')

const insert = (user) => {
    return db('users').insert(user).returning(['id','email','username'])
}

const getOne = (filter) => {
    return db('users').where(filter).first()
}


module.exports = {
    insert,
    getOne
}