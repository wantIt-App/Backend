
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('invites').del()
    .then(function () {
      // Inserts seed entries
      return knex('invites').insert([
        {id: 1, invitee_id: 2, list_id: 1},
        {id: 2, invitee_id: 3, list_id: 1},
        {id: 3, invitee_id: 1, list_id: 2},
        {id: 4, invitee_id: 3, list_id: 2},
        {id: 5, invitee_id: 1, list_id: 3},
        {id: 6, invitee_id: 2, list_id: 3}
      ]);
    });
};
