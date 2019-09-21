
exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
        table.increments()
        table.string('username')
            .unique()
            .notNull()
        table.string('email')
            .unique()
            .notNull()
        table.string('password')
            .notNull()
        table.datetime('created_at')
            .defaultTo(knex.fn.now())
    })
    .createTable('lists', table => {
        table.increments()
      table.string('name')
      table.integer('owner_id')
        .references('id')
        .inTable('users')
        .notNull()
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')
      table.datetime('created_at')
        .defaultTo(knex.fn.now())
    })
    .createTable('invites', table => {
        table.increments()
        table.integer('list_id')
            .references('id')
            .inTable('lists')
            .notNull()
            .onDelete('RESTRICT')
            .onUpdate('CASCADE')
        table.integer('invitee_id')
            .references('id')
            .inTable('users')
            .notNull()
            .onDelete('RESTRICT')
            .onUpdate('CASCADE')
        table.boolean('accepted')
            .defaultTo(false)
        table.datetime('created_at')
            .defaultTo(knex.fn.now())
    })
    .createTable('items', table => {
        table.increments()
        table.integer('list_id')
            .references('id')
            .inTable('lists')
            .notNull()
            .onDelete('RESTRICT')
            .onUpdate('CASCADE')
        table.string('description')
        table.string('title')
        table.string('picture')
        table.datetime('created_at')
            .defaultTo(knex.fn.now())
    })
    .createTable('want_its', table => {
        table.increments()
        table.integer('item_id')
            .references('id')
            .inTable('items')
            .notNull()
            .onDelete('RESTRICT')
            .onUpdate('CASCADE')
        table.integer('user_id')
            .references('id')
            .inTable('users')
            .notNull()
            .onDelete('RESTRICT')
            .onUpdate('CASCADE')
        table.datetime('created_at')
            .defaultTo(knex.fn.now())
    })
    .createTable('item_comments', table => {
        table.increments()
        table.integer('user_id')
            .references('id')
            .inTable('users')
            .notNull()
            .onDelete('RESTRICT')
            .onUpdate('CASCADE')
        table.string('content')
            .notNull()
        table.datetime('created_at')
            .defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
  knex.schema.dropTable('item_comments')
    .dropTable('want_its')
    .dropTable('items')
    .dropTable('lists')
    .dropTable('users')
};
