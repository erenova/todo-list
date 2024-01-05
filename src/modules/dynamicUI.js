import {
  addNewCategory,
  getActiveCategory,
  getAllCategories,
  getCategoryByHash,
  setActiveCategoryByHash,
} from "./category";

function updateUIForTasks() {}

function addCategoriesOnUI() {
  const categoryHolder = document.getElementById("category-holder");
  categoryHolder.innerHTML = "";
  getAllCategories().forEach((element) => {
    categoryHolder.innerHTML += `<a class="border-b border-black" data-categoryid="${element.hash}">${element.title}</a>`;
  });
}
function setActiveCategoryStyle() {
  getActiveCategoryDOMelement().classList.add("text-green-600");
  getActiveCategoryDOMelement().classList.add("bg-white");
}

function updateUIForCategories() {
  addCategoriesOnUI();
  addSwitchToAllCategories();
  setActiveCategoryStyle();
}

function getActiveCategoryDOMelement() {
  return document.querySelector(
    `[data-categoryid="${getActiveCategory().hash}"]`
  );
}

function addNewInput() {
  let inputElement = document.querySelectorAll(
    `[data-element="categoryNameInput"]`
  );
  if (inputElement.length === 0) {
    const categoryHolder = document.getElementById("category-holder");
    categoryHolder.innerHTML += `
    <form>
      <input data-element="categoryNameInput" placeholder="Enter Name" class="text-center pl-2 pr-2 bg-none w-full border-b border-black" type="text">
      <input data-element="categorySubmitInput" type="submit" value="Add" />
    </form>
    `;
    categoryHolder.scrollTop = categoryHolder.scrollHeight;
    let inputElement = document.querySelector(
      `[data-element="categorySubmitInput"]`
    );
    focusInputText();
    inputElement.addEventListener("click", addNewCategoryItemOnSubmit);
  } else {
    console.warn("Use The Active Form.");
  }
}

function addEditInput() {
  let inputElement = document.querySelectorAll(
    `[data-element="categoryNameInput"]`
  );
  if (inputElement.length === 0) {
    const categoryHolder = document.getElementById("category-holder");
    const activeCategoryDOM = getActiveCategoryDOMelement();
    categoryHolder.scrollTop = activeCategoryDOM.offsetTop - 85;

    activeCategoryDOM.outerHTML += `
    <form>
      <input data-element="categoryNameInput" placeholder="Enter Name" class="text-center pl-2 pr-2 bg-none w-full border-b border-black" type="text" value="${
        getActiveCategory().title
      }">
      <input data-element="categorySubmitInput" type="submit" value="Edit" />
    </form>
    `;
    getActiveCategoryDOMelement().remove();
    let submitElement = document.querySelector(
      `[data-element="categorySubmitInput"]`
    );
    focusInputText();
    submitElement.addEventListener("click", addNewCategoryNameOnSubmit);
  } else {
    console.warn("Use The Active Form.");
  }
}

function addNewCategoryNameOnSubmit() {
  const inputElement = document.querySelector(
    `[data-element="categoryNameInput"]`
  );
  if (inputElement.value || inputElement.value !== "") {
    getActiveCategory().title = inputElement.value;
    removeFormElement();
    updateUIForCategories();
  }
}

function addNewCategoryItemOnSubmit() {
  const inputElement = document.querySelector(
    `[data-element="categoryNameInput"]`
  );
  if (inputElement.value || inputElement.value !== "") {
    addNewCategory(inputElement.value);
    removeFormElement();
    updateUIForCategories();
  } else {
    alert("no empty value");
  }
}
function removeFormElement() {
  document.querySelector("form").remove();
}

function focusInputText() {
  document.querySelector('[type="text"]').focus();
}

function addSwitchToAllCategories() {
  document.querySelector("#category-holder").childNodes.forEach((item) => {
    item.addEventListener("click", switchToClickedCategory);
  });
}

function switchToClickedCategory(categoryElement) {
  let elementHash = categoryElement.target.dataset.categoryid;
  if (getCategoryByHash(elementHash)) {
    setActiveCategoryByHash(elementHash);
    updateUIForCategories();
  } else {
    console.warn("Sneaky alert.");
  }
}
export {
  updateUIForTasks,
  updateUIForCategories,
  getActiveCategoryDOMelement,
  addNewInput,
  removeFormElement,
  switchToClickedCategory,
  addEditInput,
};
