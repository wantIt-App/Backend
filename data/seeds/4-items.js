
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('items').del()
    .then(function () {
      // Inserts seed entries
      return knex('items').insert([
        {list_id: 1, title: 'Lamp', description: 'Ugly Lamp', picture: 'https://picsum.photos/100'},
        {list_id: 1, title: 'Bed', description: 'Iron Bed', picture: 'https://picsum.photos/100'},
        {list_id: 1, title: 'Dog', description: 'Slighty Used', picture: 'https://picsum.photos/100'},
        {list_id: 2, title: 'Watch', description: 'Ugly Watch', picture: 'https://picsum.photos/100'},
        {list_id: 2, title: 'Favorite Underwear', description: 'Slightly Used', picture: 'https://picsum.photos/100'},
        {list_id: 2, title: 'Laptop', description: 'Pretty Nice', picture: 'https://picsum.photos/100'},
        {list_id: 3, title: 'Futon', description: 'It\'s A Bed And A Couch', picture: 'https://picsum.photos/100'},
        {list_id: 3, title: 'Bed', description: 'Heavy Bed', picture: 'https://picsum.photos/100'},
        {list_id: 3, title: 'Lawn Dart Set', description: 'Slightly Dangerous', picture: 'https://picsum.photos/100'}
      ]);
    });
};
