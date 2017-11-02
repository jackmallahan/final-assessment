
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('history').del()
    .then(function () {
      // Inserts seed entries
      return knex('history').insert([
        {ID: 1, TOTAL: 69.69},
        {ID: 2, TOTAL: 99.99},
        {ID: 3, TOTAL: 55.55}
      ]);
    });
};
