
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('inventory').del()
    .then(function () {
      // Inserts seed entries
      return knex('inventory').insert([
        {ID: 1, TITLE: 'Climbing Shoes', DESCRIPTION: 'La Sportiva Climbing Shoes', IMAGE: 'https://www.rei.com/media/product/896622', PRICE: 99.55},
        {ID: 2, TITLE: 'Harness', DESCRIPTION: 'Black Diamond Mens Harness', IMAGE: 'https://www.rei.com/media/product/880933', PRICE: 50.05},
        {ID: 3, TITLE: 'Mens ATC', DESCRIPTION: 'Black Diamond ATC Belay Device', IMAGE: 'https://www.bananafingers.co.uk/images/black_diamond_atc_black.jpg', PRICE: 99.50},
        {ID: 4, TITLE: 'Grigri', DESCRIPTION: 'Grigri Belay Device', IMAGE: 'https://www.rei.com/media/product/809263', PRICE: 65.69},
      ]);
    });
};
