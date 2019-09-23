const bcrypt = require('bcrypt')

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      //Hash passwords
      const passwords = ['Abi','Karen','William']
      return Promise.all(passwords.map(pass => bcrypt.hash(pass, 10)))
    })
    .then((passHashes) => {
      // Inserts seed entries
      return knex('users').insert([{
        username: `Abi`,
        email: `Abi`,
        password: passHashes[0]
      },{
        username: `Karen`,
        email: `Karen`,
        password: passHashes[1]
      },{
        username: `Will`,
        email: `Will`,
        password: passHashes[2]
      }])
    })
};
