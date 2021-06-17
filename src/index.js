let currentEditedEle = "";
let totalItem = 0;
function initialRender() {
  let str = localStorage.getItem("groceryList");
  if (str != null) {
    let arr = JSON.parse(str);
    totalItem = arr.length;
    arr.forEach((element) => {
      createFromLocalStorage(element);
    });
  }
  if (totalItem === 0) {
    let nothing = document.getElementById("nothing");
    nothing.style.display = "block";
  }
}
function validateItemName(name) {
  name = name.trim();
  if (name.length > 0) return true;
  return false;
}

function addItem(event) {
  let placeItemName = document.getElementById("inp-item");

  if (!validateItemName(placeItemName.value)) {
    return alert("Please Enter Name");
  }

  if (event.target.value === "add-item") {
    addItemTrue(event);
  } else {
    placeItemName.removeAttribute("readonly");
    addItemFalse(event);
  }
}
function createFromLocalStorage(element) {
  let div = document.createElement("div");
  let innerdiv = document.createElement("div");
  let btn1 = document.createElement("button");
  let btn2 = document.createElement("button");

  btn1.innerText = "Edit";
  btn1.value = element.qt;
  btn2.innerText = "Delete";
  innerdiv.innerText = element.name;
  div.classList.add("item");
  innerdiv.classList.add("item-text");
  btn1.classList.add("item-edit");
  btn2.classList.add("item-delete");
  div.appendChild(innerdiv);
  div.appendChild(btn1);
  div.appendChild(btn2);

  let listitem = document.getElementById("list-item");
  listitem.appendChild(div);
  btn1.addEventListener("click", editItem);
  btn2.addEventListener("click", deleteItem);
}
function deleteFromLocalStorage(name) {
  let str = localStorage.getItem("groceryList");
  let arr = JSON.parse(str);
  let newArr = arr.filter((item) => {
    if (item.name == name) {
      return false;
    }
    return true;
  });
  localStorage.setItem("groceryList", JSON.stringify(newArr));
}
function editFromLocalSorage(oldName, oldqt, newName, newqt) {
  let str = localStorage.getItem("groceryList");
  let arr = JSON.parse(str);
  let newArr = arr.map((item) => {
    if (item.name == oldName) {
      return { ...item, name: newName, qt: newqt };
    }
    return item;
  });
  localStorage.setItem("groceryList", JSON.stringify(newArr));
}
function isAlready(name) {
  let str = localStorage.getItem("groceryList");
  let available = false;
  if (str != null) {
    let arr = JSON.parse(str);
    arr.forEach((item) => {
      if (item.name == name) available = true;
    });
  }
  return available;
}
function updateQuantity(name, quantity) {
  let str = localStorage.getItem("groceryList");
  let arr = JSON.parse(str);
  let id = -1;
  let newqt = 0;
  let newArr = arr.map((item, index) => {
    if (item.name == name) {
      let newQuantity = String(Number(item.qt) + Number(quantity));
      id = index;
      newqt = newQuantity;
      return { ...item, qt: newQuantity };
    }
    return item;
  });
  localStorage.setItem("groceryList", JSON.stringify(newArr));
  let listitem = document.querySelectorAll(".item");
  listitem[id].childNodes[1].value = newqt;
  let olditemName = document.getElementById("inp-item");
  let oldquantity = document.getElementById("inp-qt");
  olditemName.value = "";
  oldquantity.value = "";
}
function addItemTrue() {
  let itemName = document.getElementById("inp-item");
  let quantity = document.getElementById("inp-qt");

  if (isAlready(itemName.value) === true) {
    updateQuantity(itemName.value, quantity.value);
  } else {
    totalItem++;
    if (totalItem !== 0) {
      let nothing = document.getElementById("nothing");
      nothing.style.display = "none";
    }
    let div = document.createElement("div");
    let innerdiv = document.createElement("div");
    let btn1 = document.createElement("button");
    let btn2 = document.createElement("button");
    btn1.innerText = "Edit";
    btn1.value = quantity.value;
    btn2.innerText = "Delete";
    innerdiv.innerText = itemName.value;
    div.classList.add("item");
    innerdiv.classList.add("item-text");
    btn1.classList.add("item-edit");
    btn2.classList.add("item-delete");
    div.appendChild(innerdiv);
    div.appendChild(btn1);
    div.appendChild(btn2);
    let obj = {
      name: itemName.value,
      qt: quantity.value,
    };
    itemName.value = "";
    quantity.value = "";

    let listitem = document.getElementById("list-item");
    listitem.appendChild(div);
    btn1.addEventListener("click", editItem);
    btn2.addEventListener("click", deleteItem);

    addToLocalStorage(obj);
  }
}
function addToLocalStorage(obj) {
  let str = localStorage.getItem("groceryList");
  let arr = [];

  if (str != null) {
    arr = JSON.parse(str);
  }
  arr.push(obj);
  localStorage.setItem("groceryList", JSON.stringify(arr));
}
function addItemFalse() {
  let placeItemName = document.getElementById("inp-item");
  let placeQuantity = document.getElementById("inp-qt");
  editFromLocalSorage(
    currentEditedEle.childNodes[0].innerText,
    currentEditedEle.childNodes[1].value,
    placeItemName.value,
    placeQuantity.value
  );
  let name = document.getElementById("action-heading");
  name.innerText = "Add Grocery Item";

  currentEditedEle.childNodes[0].innerText = placeItemName.value;
  placeItemName.value = "";

  currentEditedEle.childNodes[1].value = placeQuantity.value;
  placeQuantity.value = "";

  let btn = document.getElementById("add-btn");
  btn.value = "add-item";
  btn.innerText = "Add Item";
}
function editItem(event) {
  let name = document.getElementById("action-heading");
  let placeItemName = document.getElementById("inp-item");
  placeItemName.setAttribute("readonly", true);
  name.innerText = "Edit Grocery Item";
  let itemName = event.target.parentNode.childNodes[0].innerText;
  placeItemName.value = itemName;

  let quantity = event.target.value;
  let placeQuantity = document.getElementById("inp-qt");
  placeQuantity.value = quantity;

  let btn = document.getElementById("add-btn");
  btn.value = "edit-item";
  btn.innerText = "Edit Item";
  currentEditedEle = event.target.parentNode;
}
function deleteItem(event) {
  totalItem--;
  let parent = event.target.parentNode;
  deleteFromLocalStorage(
    parent.childNodes[0].innerText,
    parent.childNodes[1].value
  );
  parent.remove();
  if (totalItem === 0) {
    let nothing = document.getElementById("nothing");
    nothing.style.display = "block";
  }
}

let btn = document.getElementById("add-btn");
btn.addEventListener("click", addItem);
initialRender();
