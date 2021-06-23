let model = {
  groceryList: [],
  currentEditedEle: "",
  totalItem: 0,
  init: function () {
    let list = localStorage.getItem("groceryList");
    if (list !== null) {
      this.groceryList = JSON.parse(list);
    }
    this.totalItem = this.groceryList.length;
  },
  setCurrentEditedElement: function (element) {
    this.currentEditedEle = element;
  },
  incrementToalItem: function () {
    this.totalItem++;
  },
  decreamentTotalItem: function () {
    this.totalItem--;
  },
  setItemList: function () {
    localStorage.setItem("groceryList", JSON.stringify(this.groceryList));
  },

  addItemToList: function (obj) {
    this.groceryList.push(obj);
    this.setItemList();
  },

  deleteItemFromList: function (name) {
    let newArr = this.groceryList.filter((item) => {
      if (item.name === name) {
        return false;
      }
      return true;
    });
    this.groceryList = newArr;
    this.setItemList();
  },
  editItemList: function (oldName, oldqt, newName, newqt) {
    let arr = this.groceryList;
    let newArr = arr.map((item) => {
      if (item.name === oldName) {
        return { ...item, name: newName, qt: newqt };
      }
      return item;
    });
    this.groceryList = newArr;
    this.setItemList();
  },
  increamentQuantityOfItem: function (name, quantity) {
    let id = -1;
    let newqt = 0;
    let newArr = model.groceryList.map((item, index) => {
      if (item.name === name) {
        let newQuantity = String(Number(item.qt) + Number(quantity));
        id = index;
        newqt = newQuantity;
        return { ...item, qt: newQuantity };
      }
      return item;
    });
    model.groceryList = newArr;
    model.setItemList();
    return [id, newqt];
  },
  isAlready: function (name) {
    let available = false;
    this.groceryList.forEach((item) => {
      if (item.name === name) available = true;
    });

    return available;
  },
};
let controller = {
  init: function () {
    model.init();
    view.init();
    view.printItemFromLocalStorage(model.groceryList);
  },

  increamentQuantity: function (name, quantity) {
    const [id, newqt] = model.increamentQuantityOfItem(name, quantity);
    view.increamentQuantityOfItem(id, newqt);
  },
  addItemInAddWorkFlow: function () {
    let itemName = document.getElementById("inp-item");
    let quantity = document.getElementById("inp-qt");

    if (model.isAlready(itemName.value) === true) {
      this.increamentQuantity(itemName.value, quantity.value);
    } else {
      model.incrementToalItem();
      if (model.totalItem !== 0) {
        view.removeEmptyMessage();
      }
      const element = {
        name: itemName.value,
        qt: quantity.value,
      };
      view.createItem(element);

      model.addItemToList(element);

      view.clearForm();
    }
  },
  addItemInEditWorkFlow: function () {
    let name = document.getElementById("inp-item");
    let quantity = document.getElementById("inp-qt");
    model.editItemList(
      model.currentEditedEle.childNodes[0].childNodes[0].innerText,
      model.currentEditedEle.childNodes[1].value,
      name.value,
      quantity.value
    );
    model.currentEditedEle.childNodes[0].childNodes[0].innerText = name.value;
    model.currentEditedEle.childNodes[0].childNodes[1].innerText =
      "x " + quantity.value;
    model.currentEditedEle.childNodes[1].value = quantity.value;

    view.activeAddWorkFlow();
    model.setCurrentEditedElement("");
  },
  addItem: function (event) {
    let placeItemName = document.getElementById("inp-item");
    let placeQt = document.getElementById("inp-qt");

    placeQt.value = Number(placeQt.value).toString();

    let newName = placeItemName.value.trim();
    document.getElementById("inp-item").value = newName;

    if (event.target.value === "add-item") {
      controller.addItemInAddWorkFlow(); //When Add workflow is on
    } else {
      placeItemName.removeAttribute("readonly");
      controller.addItemInEditWorkFlow(); //When Edit workflow is on
    }
    view.disableButton();
  },
  editItem: function (event) {
    view.enableButton();
    view.acticeEditWorkFlow(event);
    model.setCurrentEditedElement(event.target.parentNode);
  },
  deleteItem: function (event) {
    if (model.currentEditedEle !== event.target.parentNode) {
      model.decreamentTotalItem();
      let parent = event.target.parentNode;
      model.deleteItemFromList(parent.childNodes[0].childNodes[0].innerText);
      view.deleteDOMelement(parent);
      if (model.totalItem === 0) {
        view.showEmptyMessage();
      }
    } else {
      alert("You can not delete item that are from Edit section.");
    }
  },
};
let view = {
  init: function () {
    this.btn = document.getElementById("add-btn");
    this.name = document.getElementById("inp-item");
    this.quantity = document.getElementById("inp-qt");
    this.listitem = document.getElementById("list-item");
    this.heading = document.getElementById("action-heading");
    this.itemarray = document.querySelectorAll(".item");
    this.btn.addEventListener("click", controller.addItem);
  },
  printItemFromLocalStorage: function (arr) {
    arr.forEach((element) => {
      this.createItem(element);
    });
    if (arr.length === 0) {
      this.showEmptyMessage();
    }
  },
  inputChanged: function () {
    this.name.value = this.name.value.trim();

    if (Number(this.quantity.value) === 0) this.quantity.value = "";
    if (this.name.value.length > 0 && this.quantity.value.length > 0)
      this.enableButton();
    else this.disableButton();
  },
  disableButton: function () {
    this.btn.disabled = true;
  },
  enableButton: function () {
    this.btn.disabled = false;
  },
  deleteDOMelement: function (element) {
    element.remove();
  },
  acticeEditWorkFlow: function (event) {
    this.name.setAttribute("readonly", true);
    this.heading.innerText = "Edit Grocery Item";

    let itemName =
      event.target.parentNode.childNodes[0].childNodes[0].innerText;
    this.name.value = itemName;

    let quantity = event.target.value;
    this.quantity.value = quantity;

    this.btn.value = "edit-item";
    this.btn.innerText = "Edit Item";
  },
  activeAddWorkFlow: function () {
    this.heading.innerText = "Add Grocery Item";

    this.clearForm();

    this.btn.value = "add-item";
    this.btn.innerText = "Add Item";
  },
  increamentQuantityOfItem: function (id, newqt) {
    let itemarray = document.querySelectorAll(".item");
    itemarray[id].childNodes[1].value = newqt;
    itemarray[id].childNodes[0].childNodes[1].innerText = "x " + newqt;
    this.clearForm();
  },
  showEmptyMessage: function () {
    let p = document.createElement("p");
    p.setAttribute("id", "nothing");
    p.innerText = "Nothing to Show!!";
    this.listitem.appendChild(p);
  },
  removeEmptyMessage: function () {
    let nothing = document.getElementById("nothing");
    if (nothing) nothing.remove();
  },
  clearForm: function () {
    this.name.value = "";
    this.quantity.value = "";
  },
  createItem: function (element) {
    let div = document.createElement("div");
    let innerdiv = document.createElement("div");
    let innerdiv1 = document.createElement("div");
    let innerdiv2 = document.createElement("div");
    let btn1 = document.createElement("button");
    let btn2 = document.createElement("button");

    btn1.innerText = "Edit";
    btn1.value = element.qt;
    btn2.innerText = "Delete";

    innerdiv1.innerText = element.name;
    innerdiv2.innerText = "x " + element.qt;

    div.classList.add("item");
    innerdiv.classList.add("item-text");
    innerdiv1.classList.add("item-text-1");
    innerdiv2.classList.add("item-text-2");

    btn1.classList.add("item-edit");
    btn2.classList.add("item-delete");

    innerdiv.appendChild(innerdiv1);
    innerdiv.appendChild(innerdiv2);
    div.appendChild(innerdiv);
    div.appendChild(btn1);
    div.appendChild(btn2);

    this.listitem.appendChild(div);
    btn1.addEventListener("click", controller.editItem);
    btn2.addEventListener("click", controller.deleteItem);
  },
};

controller.init();
