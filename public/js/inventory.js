'use strict'

// Get a list of items in inventory based on the classification_id 
let classificationList = document.querySelector("#classificationList") //why reference classificationList instead of classificationSelect?
classificationList.addEventListener("change", function () { 
 let classification_id = classificationList.value 
 console.log(`classification_id is: ${classification_id}`) 
 let classIdURL = "/inv/getInventory/"+classification_id 
 fetch(classIdURL) 
 .then(function (response) { 
  if (response.ok) { 
   return response.json(); 
  } 
  throw Error("Network response was not OK"); 
 }) 
 .then(function (data) { 
  console.log(data); 
  buildInventoryList(data); 
 }) 
 .catch(function (error) { 
  console.log('There was a problem: ', error.message) 
 }) 
})
//this function requests the data, based on the classification_ID and catches any errors if they exist, and sends the retrieved data to the buildInventoryList function for building it into HTML and then displays it into the management view


// Build inventory items into HTML table components and inject into DOM 
function buildInventoryList(data) {
    let inventoryDisplay = document.getElementById("inventoryDisplay");
    
    // Set up the table labels
    let dataTable = '<thead>';
    dataTable += '<tr><th>Vehicle Name</th><th>Edit</th><th>Delete</th></tr>';
    dataTable += '</thead>';
    
    // Set up the table body
    dataTable += '<tbody>';
  
    // Iterate over all vehicles in the array and put each in a row
    data.forEach(function (element) {
      console.log(element.inv_id + ", " + element.inv_model);
      dataTable += `<tr>`;
      dataTable += `<td>${element.inv_make} ${element.inv_model}</td>`;
      
      // Edit button
      dataTable += `
        <td>
          <button class="action-btn edit-btn" onclick="window.location.href='/inv/edit/${element.inv_id}'" title="Edit Vehicle">
            <i class="fas fa-edit"></i>
          </button>
        </td>`;
      
      // Delete button
      dataTable += `
        <td>
          <button class="action-btn delete-btn" onclick="confirmDelete(${element.inv_id})" title="Delete Vehicle">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>`;
      
      dataTable += `</tr>`;
    });
  
    dataTable += '</tbody>';
  
    // Display the contents in the Inventory Management view
    inventoryDisplay.innerHTML = dataTable;
  }
  
   
//next we edit the inventory route