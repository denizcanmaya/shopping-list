const shoppingList = document.querySelector(".shopping-list");
const shoppingForm = document.querySelector(".shopping-form");
const filterButtons = document.querySelectorAll(".filter-buttons button");
const clearBtn = document.querySelector(".clear");

document.addEventListener("DOMContentLoaded", function() {
  loadItems();
  displayAlert();
  shoppingForm.addEventListener("submit", handleFormSubmit);

  for (let button of filterButtons) {
    button.addEventListener("click", handleFilterSelection);
  }

  clearBtn.addEventListener("click", clear);
});

function displayAlert(){
 const isEmpty = shoppingList.querySelectorAll("li").length === 0;

 const alert = document.querySelector(".alert");
 alert.classList.toggle("d-none", !isEmpty);
}

function clear() {
  shoppingList.innerHTML = "";
  localStorage.clear("shoppingItems");
  displayAlert();
}

function saveToLS() {
  const listItems = shoppingList.querySelectorAll("li");
  const liste = [];

  for (let li of listItems) {
    const id = li.getAttribute("item-id");
    const name = li.querySelector(".item-name").textContent;
    const completed = li.hasAttribute("item-completed");

    liste.push({id, name, completed});
  }

  localStorage.setItem("shoppingItems", JSON.stringify(liste));

}

function loadItems() {
  const items = JSON.parse(localStorage.getItem("shoppingItems")) || [];
  shoppingList.innerHTML = "";

  for (let item of items) {
    const li = createListItem(item);
    shoppingList.appendChild(li);
  }
}

function addItem(input) {
  const newItem = createListItem({
    id: generateId(),
    name: input.value,
    completed: false,
  });
  shoppingList.appendChild(newItem);
  input.value = "";
  updateFilteredItems();
  saveToLS();
  displayAlert();
}

function generateId() {
  return Date.now().toString();
}

function handleFormSubmit(e) {
  e.preventDefault();

  const input = document.getElementById("item_name");

  if (input.value.trim().length === 0) {
    alert("Değer Giriniz!");
    return;
  }

  addItem(input);
}

function toggleCompleted(e) {
  const li = e.target.parentElement;
  li.toggleAttribute("item-completed", e.target.checked);
  updateFilteredItems();
  saveToLS();
}

function createListItem(item) {
  //! Checkbox
  const input = document.createElement("input");
  input.type = "checkbox";
  input.classList.add("form-check-input");
  input.checked = item.completed;
  input.addEventListener("change", toggleCompleted);

  //? item
  const div = document.createElement("div");
  div.textContent = item.name;
  div.classList.add("item-name");

  //? delete icon
  const deleteIcon = document.createElement("i");
  deleteIcon.className = "fs-3 bi bi-x delete-icon";
  deleteIcon.addEventListener("click", removeItem);

  //? li
  const li = document.createElement("li");
  li.setAttribute("item-id", item.id);
  li.className = "border rounded p-3 mb-1";
  li.toggleAttribute("item-completed", item.completed);

  li.appendChild(input);
  li.appendChild(div);
  li.appendChild(deleteIcon);

  return li;
}

function removeItem(e) {
  const li = e.target.parentElement;
  shoppingList.removeChild(li);
  saveToLS();
  displayAlert();
}

function handleFilterSelection(e) {
  const filterBtn = e.target;
  for (let button of filterButtons) {
    button.classList.add("btn-secondary");
    button.classList.remove("btn-primary");
  }

  filterBtn.classList.add("btn-primary");
  filterBtn.classList.remove("btn-secondary");

  filterItems(filterBtn.getAttribute("item-filter"));
}

function filterItems(filterType) {
  const li_items = shoppingList.querySelectorAll("li");

  for (let li of li_items) {
    li.classList.remove("d-flex")
    li.classList.remove("d-none")
    
    const completed = li.hasAttribute("item-completed");

    if (filterType == "completed") {
      // Completed
      li.classList.toggle (completed ? "d-flex":"d-none");
    } else if (filterType == "incompleted") {
      li.classList.toggle (completed ? "d-none":"d-flex");
      //incompleted
    } else {
      //all
      li.classList.toggle ("d-flex");
    }
  }
}

function updateFilteredItems() {
  const activeFilter = document.querySelector(".btn-primary[item-filter]");
  filterItems(activeFilter.getAttribute("item-filter"));
}
