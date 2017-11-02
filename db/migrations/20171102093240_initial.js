exports.up = (knex, Promise) => {
	return Promise.all([
		knex.schema.createTable('inventory', table => {
			table.increments('ID').primary()
			table.string('TITLE')
			table.string('DESCRIPTION')
			table.string('IMAGE')
			table.decimal('PRICE')
			table.timestamps(true, true)
		}),
		knex.schema.createTable('history', table => {
      table.increments('ID').primary()
			table.decimal('TOTAL')
			table.timestamps(true, true)
		})
	])
}

exports.down = (knex, Promise) => {
	return Promise.all([knex.schema.dropTable('history'), knex.schema.dropTable('inventory')])
}
