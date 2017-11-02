const getInventory = () => {
  fetch('/api/v1/inventory')
    .then(response => response.json())
    .then(response => appendInventory(response))
    .catch(error => console.log(error))
};

const getHistory = () => {
  fetch('/api/v1/history')
    .then(response => response.json())
    .then(response => appendHistory(response))
    .catch(error => console.log(error))
};

const appendInventory = itemArray => {
  itemArray.forEach(item => {
    $('.inventory').append(`
        <article class='item-card'>
          <h3 class='item-title' >${item.TITLE}</h3>
          <img class='item-image' src=${item.IMAGE} />
          <p class='item-description'>${item.DESCRIPTION}</p>
          <h5 class='item-price' >${item.PRICE}</h5>
          <div class='add-btn' data-title='${item.TITLE}' data-price=${item.PRICE}>Add to Cart</div>
        </article>
      `)
  })
};

const appendHistory = historyArray => {
  historyArray.forEach(order => {
    $('.history').append(`
        <article class='order-card'>
          <h3 class='order-id'>Order #${order.ID}</h3>
          <h5 class='order-date'>Order Date: ${order.created_at.slice(0, 10)}</h5>
          <h5 class='order-total'>Order Total: $${order.TOTAL}</h5>
        </article>
      `)
  })
};

const getCart = () => {
  const storedCart = localStorage.getItem('cartArray');
  const returnedCart = JSON.parse(storedCart) || [];
  appendCart(returnedCart)
}

const appendCart = cartArray => {
  if(!cartArray.length){
    return null;
  }
  cartArray.forEach(item => {
    console.log(item);
    $('.cart-items').append(`
      <article class='cart-card'>
        <h3 class='item-id'>${item.title}</h3>
        <h5 class='item-price'>Price: $${item.price}</h5>
      </article>
      `);
  });
};

const addToCart = e => {
  $('.cart-items').empty()
  const storedCart = localStorage.getItem('cartArray');
  const returnedCart = JSON.parse(storedCart) || [];
  let newCart = [...returnedCart, {price: e.target.dataset.price, title: e.target.dataset.title}];
  localStorage.setItem('cartArray', JSON.stringify(newCart));
  appendCart(newCart);
}

const getTotal = () => {
  const storedCart = localStorage.getItem('cartArray');
  const returnedCart = JSON.parse(storedCart) || [];
  let total = returnedCart.reduce((accu, item, i) => {
    accu += JSON.parse(item.price)
    return accu
  }, 0)
  return total
}

const checkOut = () => {
  let orderTotal = getTotal();
  fetch('/api/v1/history', {
    method: "POST",
    body: JSON.stringify({TOTAL: orderTotal}),
    headers: {"Content-Type": "application/json"}
  })
    .then(response => response.json())
    .then(response => {
      getHistory();
      localStorage.clear();
    })
    .catch(error => console.log(error))
  $('.cart-items').empty()
}

$(document).ready(()=> {
  getInventory();
  getHistory();
  getCart();
});

$('.order-history').click(() => $('.history').toggle());
$('.cart').click(() => $('.cart-page').toggle());
$('.inventory').on('click', '.add-btn', addToCart)
$('.order-btn').on('click', () => {
  $('.history').empty();
  checkOut();
})
