
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('want_its').del()
    .then(function () {
      // Inserts seed entries
      return knex('want_its').insert([
        {id: 1, item_id: 1, user_id: 2},
        {id: 2, item_id: 2, user_id: 3},
        {id: 3, item_id: 5, user_id: 1},
        {id: 4, item_id: 6, user_id: 3},
        {id: 5, item_id: 7, user_id: 1},
        {id: 6, item_id: 8, user_id: 2},
      ]);
    });
};
