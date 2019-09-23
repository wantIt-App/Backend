
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('lists').del()
    .then(function () {
      // Inserts seed entries
      return knex('lists').insert([
        {owner_id: 1, name: 'Mom\'s Stuff', description: 'Items that belonged to Mom.'},
        {owner_id: 2, name: 'He Cheated...', description: '...I\'m getting even.'},
        {owner_id: 3, name: 'Moving Out', description: 'Anyone need/want anything?'}
      ]);
    });
};
