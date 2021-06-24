let model = {
  groceryList: [],
  currentEditedEle: "",

  init: function () {
    let list = localStorage.getItem("groceryList");
    if (list !== null) {
      this.groceryList = JSON.parse(list);
    }
  },
  setCurrentEditedElement: function (element) {
    this.currentEditedEle = element;
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
    let newArr = model.groceryList.map((item, index) => {
      if (item.name === name) {
        let newQuantity = String(Number(item.qt) + Number(quantity));
        return { ...item, qt: newQuantity };
      }
      return item;
    });
    model.groceryList = newArr;
    model.setItemList();
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
    view.renderList(model.groceryList);
  },

  increamentQuantity: function (name, quantity) {
    model.increamentQuantityOfItem(name, quantity);
    view.renderList(model.groceryList);
    view.clearForm();
  },
  addItemInAddWorkFlow: function () {
    const element = view.getFormInput();
    if (model.isAlready(element.name) === true) {
      this.increamentQuantity(element.name, element.qt);
    } else {
      model.addItemToList(element);
      view.renderList(model.groceryList);
      view.clearForm();
    }
  },
  addItemInEditWorkFlow: function () {
    const element = view.getFormInput();
    model.editItemList(
      model.currentEditedEle.childNodes[0].childNodes[0].innerText,
      model.currentEditedEle.childNodes[1].value,
      element.name,
      element.qt
    );

    view.activeAddWorkFlow();
    view.renderList(model.groceryList);
    view.clearForm();
    model.setCurrentEditedElement("");
  },
  addItem: function (event) {
    view.changeQuantityToNumber();
    view.trimItemName();
    if (event.target.value === "add-item") {
      controller.addItemInAddWorkFlow(); //When Add workflow is on
    } else {
      view.setInputReadOnly();
      controller.addItemInEditWorkFlow(); //When Edit workflow is on
    }
    view.disableButton();
  },
  editItem: function (event) {
    view.enableButton();
    view.activeEditWorkFlow(event);
    model.setCurrentEditedElement(event.target.parentNode);
  },
  deleteItem: function (event) {
    if (model.currentEditedEle !== event.target.parentNode) {
      let parent = event.target.parentNode;
      model.deleteItemFromList(parent.childNodes[0].childNodes[0].innerText);
      view.renderList(model.groceryList);
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
  renderList: function (arr) {
    let items = [];
    arr.forEach((element) => {
      items.push(this.createItem(element));
    });
    this.listitem.innerHTML = "";
    if (arr.length === 0) {
      this.showEmptyMessage();
    } else {
      this.listitem.append(...items);
    }
  },
  inputChanged: function () {
    let trimmedName = this.name.value.trim();
    if (Number(this.quantity.value) === 0) this.quantity.value = "";
    if (trimmedName.length > 0 && this.quantity.value.length > 0)
      this.enableButton();
    else this.disableButton();
  },
  disableButton: function () {
    this.btn.disabled = true;
  },
  enableButton: function () {
    this.btn.disabled = false;
  },
  getFormInput: function () {
    return {
      name: this.name.value,
      qt: this.quantity.value,
    };
  },

  changeQuantityToNumber: function () {
    this.quantity.value = Number(this.quantity.value);
  },
  trimItemName: function () {
    this.name.value = this.name.value.trim();
  },
  setInputReadOnly: function () {
    this.name.removeAttribute("readonly");
  },

  activeEditWorkFlow: function (event) {
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

  showEmptyMessage: function () {
    let p = document.createElement("p");
    p.setAttribute("id", "nothing");
    p.innerText = "Nothing to Show!!";
    this.listitem.appendChild(p);
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

    btn1.addEventListener("click", controller.editItem);
    btn2.addEventListener("click", controller.deleteItem);
    return div;
  },
};

controller.init();
