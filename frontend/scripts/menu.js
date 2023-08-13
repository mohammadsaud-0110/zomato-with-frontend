const URL = "http://127.0.0.1:8000";

// fetching Menu
async function fetchMenu(){
    await fetch(`${URL}/menu`)
            .then((res)=>res.json())
            .then((data)=>{
                // console.log(data.menu);
                displayMenu(data.menu);
            })
            .catch((err)=>console.log(err))
}

fetchMenu()

function displayMenu(data) {
    // Get a reference to the container element where you want to display the table
    const container = document.getElementById('box-left');

    const heading1 = document.createElement('h2');
    heading1.textContent = "Menu"
    // Create a new table element
    const table = document.createElement('table');

    // Create the table header (thead) and table body (tbody) elements
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Create header row and cells
    const headerRow = document.createElement('tr');
    const headerCells = ['Dish ID', 'Dish Name', 'Dish Price', 'Dish Availability', 'Actions', 'Edit Availability'];
    headerCells.forEach(headerText => {
        const cell = document.createElement('th');
        cell.textContent = headerText;
        headerRow.appendChild(cell);
    });

    // Append the header row to the thead
    thead.appendChild(headerRow);

    // Create table rows and cells based on the data
    data.forEach(dish => {
        const row = document.createElement('tr');

        const dishIdCell = document.createElement('td');
        dishIdCell.textContent = dish.dishId;
        row.appendChild(dishIdCell);

        const dishNameCell = document.createElement('td');
        dishNameCell.textContent = dish.dishName;
        row.appendChild(dishNameCell);

        const dishPriceCell = document.createElement('td');
        dishPriceCell.textContent = dish.dishPrice;
        row.appendChild(dishPriceCell);

        const dishAvailabilityCell = document.createElement('td');
        dishAvailabilityCell.textContent = dish.dishAvailability;
        row.appendChild(dishAvailabilityCell);

        // Create "Remove" button
        const removeButtonCell = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-button');
        removeButton.addEventListener('click', () => {
            // Call a function to handle remove action here
            // For example: handleRemove(dish.dishId);
            removeDish(dish.dishId);
        });
        removeButtonCell.appendChild(removeButton);
        row.appendChild(removeButtonCell);

        // Create "Update" button
        const updateButtonCell = document.createElement('td');
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.classList.add('update-button');
        updateButton.addEventListener('click', (e) => {
            e.preventDefault();
            // Call a function to handle update action here
            // For example: handleUpdate(dish.dishId);
            updateDish(dish.dishId);
        });
        updateButtonCell.appendChild(updateButton);
        row.appendChild(updateButtonCell);

        tbody.appendChild(row);
    });

    // Append thead and tbody to the table
    table.appendChild(thead);
    table.appendChild(tbody);

    // Clear the container and append the table
    container.innerHTML = '';
    container.append(heading1,table);
}

// update dish availability by ID
async function updateDish(Id){
    await fetch(`${URL}/dish/update?dishId=${Id}`)
                .then((res)=>res.json())
                .then((data)=>{
                    // console.log(data);
                    fetchMenu();
                })
                .catch((err)=>console.log(err))
}

// remove dish from Menu by ID
async function removeDish(Id){
    await fetch(`${URL}/dish/remove?dishId=${Id}`)
           .then((res)=>res.json())
           .then((data)=>{
                console.log(data);
           })
           .catch((err)=>console.log(err))
}

const form = document.querySelector("#box-right form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const dishName = document.querySelector("#dish-name").value;
        const dishPrice = parseFloat(document.querySelector("#dish-price").value);
        const dishAvailability = document.querySelector("#dish-availability").value;

        const requestData = {
            dishName: dishName,
            dishPrice: dishPrice,
            dishAvailability: dishAvailability
        };

        // const URL = "http://127.0.0.1:8000"; // Update with your backend URL

        try {
            const response = await fetch(`${URL}/dish/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            });

            const responseData = await response.json();

            // Display the response message using a modal, prompt, or alert
            alert(responseData.msg); // You can replace alert with a more sophisticated UI component

            // Clear the form fields after successful submission
            form.reset();
        } catch (error) {
            console.error("Error:", error);
        }
    });

    