const URL = "http://127.0.0.1:8000";

// fetching orders
async function fetchOrders() {
    await fetch(`${URL}/order`)
            .then((res)=>res.json())
            .then((data)=>{
                // console.log(data.order_data);
                displayOrder(data.order_data);
            })
            .catch((err)=>console.log(err))
}

fetchOrders();

// Function to display orders in the order-box
function displayOrder(orders) {
  const orderBox = document.getElementById('order-box');
  
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  
  const headerRow = document.createElement('tr');
  ['Order ID', 'Customer Name', 'Ordered Dish(es)', 'Price', 'Total Price', 'Status', 'Update'].forEach(headerText => {
      const cell = document.createElement('th');
      cell.textContent = headerText;
      headerRow.appendChild(cell);
  });
  thead.appendChild(headerRow);
  
  orders.forEach(order => {
      const row = document.createElement('tr');
      
      const orderCell = document.createElement('td');
      orderCell.textContent = order.orderId;
      row.appendChild(orderCell);
      
      const customerCell = document.createElement('td');
      customerCell.textContent = order.customerName;
      row.appendChild(customerCell);
      
      const orderedDishesCell = document.createElement('td');
      const orderedDishNames = order.orderedDishes.map(dish => dish.dishName).join(', ');
      orderedDishesCell.textContent = orderedDishNames;
      row.appendChild(orderedDishesCell);
      
      const priceCell = document.createElement('td');
      priceCell.textContent = order.orderedDishes.map(dish => dish.dishPrice).join(' + ');
      row.appendChild(priceCell);
      
      const totalPriceCell = document.createElement('td');
      totalPriceCell.textContent = order.orderPrice;
      row.appendChild(totalPriceCell);
      
      const statusCell = document.createElement('td');
      statusCell.textContent = order.status;
      row.appendChild(statusCell);

      const updateTd = document.createElement('td');
      const updateButton = document.createElement('button');
      updateButton.textContent = "Update Order";
      updateButton.addEventListener("click", (e)=>{
        e.preventDefault();
        updateOrder(order);
      })
      updateTd.appendChild(updateButton)
      row.appendChild(updateTd);

      
      tbody.appendChild(row);
  });
  
  table.appendChild(thead);
  table.appendChild(tbody);
  orderBox.appendChild(table);
}

// update order
async function updateOrder(order){
  console.log(order);
  let newStatus = "";
  if(order.status == 'received'){
    newStatus = 'preparing';
  }
  else if(order.status == 'preparing'){
    newStatus = "ready for pickup";
  }
  else if(order.status == 'ready for pickup'){
    newStatus = "delivered";
  }
  else{
    return;
  }

  // console.log(order,newStatus);

  await fetch(`${URL}/order/update?orderId=${order.orderId}&newStatus=${newStatus}`)
        .then((res)=>res.json())
        .then((data)=>{
          alert(data.msg);
          fetchOrders();
        })
        .catch((err)=>console.log(err))

}

// fetching menu
async function fetchMenu(){ 
    // Fetch available dishes from the API
    await fetch(`${URL}/menu`)
      .then(response => response.json())
      .then(data => {
        const availableDishes = data.menu.filter(dish => dish.dishAvailability === 'yes');
        showAvailableDish(availableDishes);
        // console.log(availableDishes);
      })
      .catch(error => {
        console.error('Error fetching available dishes:', error);
      });
}

fetchMenu();

// displaying menu
function showAvailableDish(menu){
    const dishSelections = document.getElementById('dish-selections');
    menu.forEach(dish => {
        const label = document.createElement('label');
        label.innerHTML = `
          <input type="checkbox" class="dish-select" name="selectedDish" value="${dish.dishId}">
           : ₹ ${dish.dishPrice} : ${dish.dishName}
          <br/>
        `;
        dishSelections.append(label);
      });
}

const orderForm = document.querySelector('#orderForm');
orderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const customerName = document.getElementById('customer-name').value;
      const selectedDishCheckboxes = document.querySelectorAll('input[name="selectedDish"]:checked');
  
      if (customerName && selectedDishCheckboxes.length > 0) {
        const selectedDishIds = Array.from(selectedDishCheckboxes).map(checkbox => parseInt(checkbox.value));
  
        const orderData = {
          customerName,
          dishIds: selectedDishIds,
        };
        makeOrder(orderData)
      }
});

// create new order
async function makeOrder(order){
    // console.log(order);
    await fetch(`${URL}/order/takeorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      })
       .then((res)=>res.json())
       .then((data)=>{
            alert(data.msg);
       })
       .catch((err)=>console.log(err))
}



