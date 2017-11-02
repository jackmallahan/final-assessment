const getInventory = () => {
  fetch('/api/v1/inventory')
    .then(response => response.json())
    .then(response => appendInventory(response))
    .catch(error => console.log(error))
}

const getHistory = () => {
  fetch('/api/v1/history')
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(error => console.log(error))
}

const appendInventory = (itemArray) => {
  itemArray.forEach(item => {
    $('.inventory').append(`
        <div class='item-card'>
          <h3 class='item-title'>${item.TITLE}</h3>
          <img class='item-image' src=${item.IMAGE} />
          <p class='item-description'>${item.DESCRIPTION}</p>
          <h5 class='item-price'>${item.PRICE}</h5>
          <button class='add-btn'>Add to Cart</button>
        </div>
      `)
  })
}


$(document).ready(()=> {
  getInventory();
  getHistory();
})
