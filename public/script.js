const getInventory = () => {
  fetch('/api/v1/inventory')
    .then(response => response.json())
    .then(response => appendInventory(response))
    .catch(error => console.log(error))
}

const getHistory = () => {
  fetch('/api/v1/history')
    .then(response => response.json())
    .then(response => appendHistory(response))
    .catch(error => console.log(error))
}

const appendInventory = itemArray => {
  itemArray.forEach(item => {
    $('.inventory').append(`
        <article class='item-card'>
          <h3 class='item-title'>${item.TITLE}</h3>
          <img class='item-image' src=${item.IMAGE} />
          <p class='item-description'>${item.DESCRIPTION}</p>
          <h5 class='item-price'>${item.PRICE}</h5>
          <button class='add-btn'>Add to Cart</button>
        </article>
      `)
  })
}

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
}


$(document).ready(()=> {
  getInventory();
  getHistory();
})

$('.order-history').click(() => {
  $('.history').toggle()
})
