const getInventory = () => {
  fetch('/api/v1/inventory')
    .then(response => response.json())
    .then(response => appendInventory(response))
    .catch(error => $('inventory').append(`Error: ${error}`));
};

const getHistory = () => {
  fetch('/api/v1/history')
    .then(response => response.json())
    .then(response => appendHistory(response))
    .catch(error => $('.history').append(`Error: ${error}`));
};

const appendInventory = itemArray => {
  itemArray.forEach(item => {
    $('.inventory').append(`
        <article class='item-card'>
          <div class='title-container'>
            <h3 class='item-title' >${item.TITLE}</h3>
          </div>
          <img class='item-image' src=${item.IMAGE} />
          <p class='item-description'>${item.DESCRIPTION}</p>
          <div class='price-container'>
            <h5 class='item-price' >${item.PRICE}</h5>
          </div>
          <div class='add-btn' data-title='${item.TITLE}' data-price=${item.PRICE}>Add to Cart</div>
        </article>
      `);
  });
};

const appendHistory = historyArray => {
  historyArray.forEach(order => {
    $('.history').append(`
        <article class='order-card'>
          <h3 class='order-id'>Order #${order.ID}</h3>
          <div class='order-info'>
            <h5 class='order-date'>Order Date: ${order.created_at.slice(0, 10)}</h5>
            <h5 class='order-total'>Order Total: $${order.TOTAL}</h5>
          </div>
        </article>
      `);
  });
};

const getCart = () => {
  const storedCart = localStorage.getItem('cartArray');
  const returnedCart = JSON.parse(storedCart) || [];
  appendCart(returnedCart);
};

const appendCart = cartArray => {
  if (!cartArray.length) {
    return null;
  }
  cartArray.forEach(item => {
    $('.cart-items').append(`
      <article class='cart-card'>
        <h3 class='item-id'>${item.title}</h3>
        <h5 class='item-price'>Price: $${item.price}</h5>
      </article>
      `);
  });
};

const addToCart = e => {
  $('.cart-items').empty();
  const storedCart = localStorage.getItem('cartArray');
  const returnedCart = JSON.parse(storedCart) || [];
  let newCart = [...returnedCart, { price: e.target.dataset.price, title: e.target.dataset.title }];
  localStorage.setItem('cartArray', JSON.stringify(newCart));
  let orderTotal = getTotal();
  appendCart(newCart, orderTotal);
};

const getTotal = () => {
  const storedCart = localStorage.getItem('cartArray');
  const returnedCart = JSON.parse(storedCart) || [];
  let total = returnedCart.reduce((accu, item) => {
    accu += JSON.parse(item.price);
    return accu;
  }, 0);
  return total;
};

const checkOut = () => {
  let orderTotal = getTotal();
  if (orderTotal !== 0) {
    fetch('/api/v1/history', {
      method: 'POST',
      body: JSON.stringify({ TOTAL: orderTotal }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(() => {
        getHistory();
        localStorage.clear();
        $('.history').empty();
      })
      .catch(error => console.log(error));
    $('.cart-items').empty();
  }
};

const appendTotal = () => {
  $('.total-display').empty();
  let total = getTotal();
  console.log(total);
  $('.cart-page').append(`<span class='total-display'>Total: $${total}</span>`);
};

$(document).ready(() => {
  getInventory();
  getHistory();
  getCart();
  appendTotal();
});

$('.order-history').click(() => $('.history').toggle());
$('.cart').click(() => $('.cart-page').toggle());
$('.inventory').on('click', '.add-btn', addToCart);
$('.inventory').on('click', '.add-btn', appendTotal);
$('.order-btn').on('click', () => {
  checkOut();
});
