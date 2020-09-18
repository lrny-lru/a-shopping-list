'use strict';
/* eslint-disable quotes */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable strict */

const dataSTORE = [
  //because storing data on the DOM is bad practice, its important to have a 'local' database; that's what this object is.
  {id: cuid(), name: 'apples', checked: false},
  {id: cuid(), name:'oranges', checked: false},
  {id:cuid(), name:'milk', checked:true},
  {id:cuid(), name:'Bread', checked:false}
];

function generateItemElement(item) {
  return `
    <li data-item-id="${item.id}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}

function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item) =>
    generateItemElement(item));

  return items.join(" ");
}

function renderShoppingList() {
  //render the shopping list in the DOM

  console.log('`renderShoppingList` ran ');
  const shoppingListItemsString = generateShoppingItemsString(dataSTORE);

  //insert that HTML into the DOM
  $('.shopping-list').html(shoppingListItemsString);
}

function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);

  dataSTORE.push({id: cuid(), name: itemName, checked: false});
}


/* <form id="js-shopping-list-form">
      <label for="shopping-list-entry">Add an item</label>
      <input type="text" name="shopping-list-entry" id="shopping-list-entry" placeholder="e.g., broccoli">
      <button type="submit">Add item</button>
    </form> */
function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function (event) {
    event.preventDefault();
    console.log('` handleNewItemSubmit` ran');

    let newItemName = $('#shopping-list-entry').val();
    $('#shopping-list-entry').val(' ');
    addItemToShoppingList(newItemName);
    renderShoppingList(); 
  });
}

function toggleCheckedForListItem(itemId) {
  console.log(" Toggling checked property for item with id " + itemId);


  const item = dataSTORE.find(item => item.id === itemId);
  item.checked = !item.checked;
}

function getItemIdFromElement(item) {
  return $(item)
    .closest('li')
    .data('item-id');
}

function handleItemCheckClicked() {
  $('.shopping-list').on('click', `.shopping-item-toggle`, event => {

    console.log('`handleItemCheckClicked` ran');

    const id = getItemIdFromElement(event.currentTarget);

    toggleCheckedForListItem(id);

    renderShoppingList();
  });

}

//responsible for deleting a list item
function deleteListItem(itemId) {
  console.log(`Deleting item with id ${itemId} from shopping list`);

  // as with `addItemToShoppingList`, this function also has the side effect of mutating the global dataSTORE value
  
  //First we find the index of the item with the specified id using the native Array.prototype.findIndex() method. Then we call `.splice` at the index of the list item we want to remove with the removeCount of 1

  const itemIndex = dataSTORE.findIndex(t => t.id === itemId);
  dataSTORE.splice(itemIndex,1);

}

function handleDeleteItemClicked() {
  //like in `HnadleItemCheckClicked`, we use event delegation 
  $('.shopping-list').on('click', '.shopping-item-delete', (e) => {
    //get the ID of the item from teh HTML

    const itemId = getItemIdFromElement(e.currentTarget);

    //delete the item
    deleteListItem(itemId);
    //render the updated shopping liste

    renderShoppingList();

  });
}

// this function will be our callback when the page loads. it's responsible for intially rendering
//the shopping list, and activating our individual functions 
//that handle new item submission and user clicks on the "check"  and "delete" buttons for the indivdual shopping list items

function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
}

// after the page loads, call 'handleShoppingList'
$(handleShoppingList);