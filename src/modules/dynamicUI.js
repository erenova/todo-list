import {
  addDoneItemsToTheBottom,
  addNewCategory,
  getActiveCategory,
  getActiveTasks,
  getAllCategories,
  getCategoryByHash,
  saveToLocalStorage,
  setActiveCategoryByHash,
} from "./category";
import format from "date-fns/format";
import { addNewTask, deleteTask, getTaskWithHash } from "./task";

function updateUIForTasks() {
  addDoneItemsToTheBottom();

  let taskList = document.querySelector("#task-list");
  taskList.innerHTML = "";
  getActiveTasks().forEach((element) => {
    let isChecked = element.isDone ? "checked" : "";
    let isDone = element.isDone ? "done" : "todo";
    let taskDOM = `<div data-priority="" data-taskstatus="" id="${element.uniqueID}"
  class="task rounded-lg text-white min-h-[1rem] max-h-[4rem] pt-1 pb-1 pr-5 grid grid-cols-3 md:grid-cols-4 place-items-center place-content-center  border">
  <div  data-title
      class="break-words max-h-[2.95rem] overflow-y-auto max-w-[6rem] md:max-w-[7rem] lg:max-w-[8rem] xl:max-w-[9rem] 2xl:max-w-[10rem] place-self-center">
  </div>
  <div data-description
      class="hidden md:block break-words max-h-[2.95rem] overflow-y-auto overflow-x-hidden md:max-w-[7rem] lg:max-w-[8rem] xl:max-w-[9rem] 2xl:max-w-[10rem]">
  </div>
  <div data-date>
  </div>
  <div class="flex items-center relative">
      <span data-prioritytext></span>
      <input
          class="w-5 h-5 absolute translate-x-[280%] sm:translate-x-[350%] md:translate-x-[400%] xl:translate-x-[500%]" data-elementid="${element.uniqueID}"
          type="checkbox" ${isChecked} >
  </div>
</div>`;
    taskList.innerHTML += taskDOM;
    let newTaskElement = document.getElementById(`${element.uniqueID}`);
    newTaskElement.dataset.taskstatus = isDone;
    newTaskElement.dataset.priority = element.priority;
    newTaskElement.querySelector("[data-title]").innerText = element.title;
    newTaskElement.querySelector("[data-description]").innerText =
      element.description;
    newTaskElement.querySelector("[data-date]").innerText = element.dueDate;
    newTaskElement.querySelector("[data-prioritytext]").innerText =
      element.priority;
  });
  addStyleToTasks();
  addeventListenerForCheckbox();
  setDoneCheckboxStyle();
}

function addStyleToTasks() {
  document.querySelectorAll(`[data-priority="LOW"]`).forEach((item) => {
    item.classList.add("bg-green-700");
    item.querySelector("[data-prioritytext]").classList.add("text-green-400");
  });
  document.querySelectorAll(`[data-priority="MED"]`).forEach((item) => {
    item.classList.add("bg-orange-200");
    item.classList.add("text-slate-700");
    item.querySelector("[data-prioritytext]").classList.add("text-black");
  });
  document.querySelectorAll(`[data-priority="HIGH"]`).forEach((item) => {
    item.classList.add("bg-red-800");
    item.querySelector("[data-prioritytext]").classList.add("text-stone-50");
  });
}

updateUIForTasks();

function addCategoriesOnUI() {
  const categoryHolder = document.getElementById("category-holder");
  categoryHolder.innerHTML = "";
  getAllCategories().forEach((element) => {
    let newCategoryDomElement = document.createElement("a");
    newCategoryDomElement.className = "border-b border-black break-words";
    newCategoryDomElement.dataset.categoryid = element.hash;
    newCategoryDomElement.textContent = element.title;

    categoryHolder.appendChild(newCategoryDomElement);
  });
  updateUIForTasks();
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
    <form data-element="categoryForm">
      <input data-element="categoryNameInput" placeholder="Enter Name" class="text-center pl-2 pr-2 bg-none w-full border-b border-black" type="text" >
      <button data-element="categorySubmitInput" type="button">Add</button>
    </form>
    `;
    categoryHolder.scrollTop = categoryHolder.scrollHeight;
    let inputElement = document.querySelector(
      `[data-element="categorySubmitInput"]`
    );
    focusInputText();
    document
      .querySelector('[data-element="categoryForm"]')
      .addEventListener("submit", (e) => {
        e.preventDefault();
        const inputElement = document.querySelector(
          `[data-element="categoryNameInput"]`
        );
        if (inputElement.value || inputElement.value !== "") {
          getActiveCategory().title = inputElement.value;
          removeFormElement();
          updateUIForCategories();
          saveToLocalStorage("categoryList");
        } else {
          e.preventDefault();
          console.warn("Fill the form.");
        }
      });

    inputElement.addEventListener("click", addNewCategoryItemOnSubmit);
  } else {
    console.warn("Use The Active Form.");
  }
}

function addEditInput() {
  let inputElement = getInputElement("name");
  if (!inputElement) {
    const activeCategoryDOM = getActiveCategoryDOMelement();

    activeCategoryDOM.outerHTML += `
    <form data-element="categoryForm">
      <input data-element="categoryNameInput" placeholder="Enter Name" class="text-center pl-2 pr-2 bg-none w-full border-b border-black" type="text" >
      <button data-element="categorySubmitInput" type="button">Edit</button>
    </form>
    `;
    getActiveCategoryDOMelement().remove();
    inputElement = getInputElement();
    /* old title value */
    inputElement.value = getActiveCategory().title;
    focusInputText();
    let submitElement = getInputElement("submit");
    submitElement.addEventListener("click", addNewCategoryNameOnSubmit);

    document
      .querySelector('[data-element="categoryForm"]')
      .addEventListener("submit", (e) => {
        e.preventDefault();
        const inputElement = document.querySelector(
          `[data-element="categoryNameInput"]`
        );
        if (inputElement.value || inputElement.value !== "") {
          getActiveCategory().title = inputElement.value;
          removeFormElement();
          updateUIForCategories();
          saveToLocalStorage("categoryList");
        } else {
          e.preventDefault();
          console.warn("Fill the form.");
        }
      });
  } else {
    console.warn("Use The Active Form.");
  }
}

function getInputElement(value = "name") {
  let elementName = "categoryNameInput";
  if (value === "submit") {
    elementName = "categorySubmitInput";
  }
  return document.querySelector(`[data-element="${elementName}"]`);
}

function addNewCategoryNameOnSubmit(e) {
  const inputElement = document.querySelector(
    `[data-element="categoryNameInput"]`
  );
  if (inputElement.value || inputElement.value !== "") {
    getActiveCategory().title = inputElement.value;
    removeFormElement();
    updateUIForCategories();
    saveToLocalStorage("categoryList");
  } else {
    e.preventDefault();
    console.warn("Fill the form.");
  }
}

function scrollToActiveCategory() {
  const categoryHolder = document.getElementById("category-holder");
  const activeCategoryDOM = getActiveCategoryDOMelement();
  categoryHolder.scrollTop = activeCategoryDOM.offsetTop - 145;
}

function addNewCategoryItemOnSubmit(e) {
  e.preventDefault();
  const inputElement = document.querySelector(
    `[data-element="categoryNameInput"]`
  );
  if (inputElement.value || inputElement.value !== "") {
    addNewCategory(inputElement.value);
    removeFormElement();
    updateUIForCategories();
  } else {
  }
}
function removeFormElement() {
  document.querySelector('[data-element="categoryForm"]').remove();
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

function clickOnAddNewTask() {
  let inputElement = document.querySelectorAll('[data-element="newTaskInput"]');
  if (inputElement.length === 0) {
    let taskList = document.querySelector("#task-list");
    taskList.innerHTML += `<form data-element="newTaskInput" class="flex flex-col items-center gap-2">
      <div 
        class="rounded-lg bg-gray-600 text-black min-h-[1rem] max-h-[4rem] pt-1 pb-1 pr-5 grid grid-cols-3 md:grid-cols-4 place-items-center place-content-center border">
        <input placeholder="type the task" data-element="titleSelection" type="text"
        class="w-[85%]">
        <input  placeholder="type the desc" data-element="descriptionSelection"
        class="w-[85%] hidden md:block">
        <input type="date" class="w-[85%]" data-element="dateSelection" value="${format(
          new Date(),
          "yyyy-MM-dd"
        )}">
      
        
      
        <select data-element="prioritySelection">
      <option value="HIGH">HIGH</option>
      <option value="MED">MED</option>
      <option value="LOW">LOW</option>
        </select>
      
        
      </div>
      <div class="flex w-full items-center justify-center gap-4">
      <button type="button" data-buttonevent="addTaskToList" class="w-1/4 bg-gray-600 text-white rounded-lg">Add</button>
      <button type="button" data-buttonevent="deleteNewTaskForm" class="w-1/4 bg-gray-600 text-white rounded-lg">Cancel</button></div>
    </form>`;
    addEventListenerForTaskButton();
    addEventListenerForDeleteNewTask();
    focusInputText();
  }
}

function addTaskToList() {
  let titleValue = document.querySelector(
    '[data-element="titleSelection"]'
  ).value;
  let descriptionValue = document.querySelector(
    '[data-element="descriptionSelection"]'
  ).value;
  let dateValue = document.querySelector(
    '[data-element="dateSelection"]'
  ).value;
  let priorityValue = document.querySelector(
    '[data-element="prioritySelection"]'
  ).value;
  if (titleValue.length !== 0) {
    const getUserInputResult = addNewTask(
      titleValue,
      descriptionValue,
      dateValue,
      priorityValue
    );
    if (getUserInputResult) {
      document.querySelector('[data-element="newTaskInput"]').remove();
      updateUIForTasks();
    }
  } else {
    console.warn("fill");
  }
}

function addEventListenerForTaskButton() {
  document
    .querySelector('[data-buttonevent="addTaskToList"]')
    .addEventListener("click", addTaskToList);
}

function addEventListenerForDeleteNewTask() {
  let button = document.querySelector('[data-buttonevent="deleteNewTaskForm"]');
  button.addEventListener("click", () => {
    button.parentNode.parentNode.remove();
  });
}

function addeventListenerForCheckbox() {
  document.querySelectorAll('[type="checkbox"]').forEach((item) => {
    item.addEventListener("change", (e) => {
      if (e.target.checked) {
        setCheckboxesDone();
      } else {
        setCheckboxesTodo();
      }
      updateUIForTasks();
      setDoneCheckboxStyle();
    });
  });
}

function setCheckboxesDone() {
  document.querySelectorAll('[type="checkbox"]').forEach((item) => {
    if (item.checked) {
      getTaskWithHash(item.dataset.elementid).isDone = true;
      saveToLocalStorage("categoryList");
    }
  });
}

function setCheckboxesTodo() {
  document.querySelectorAll('[type="checkbox"]').forEach((item) => {
    if (!item.checked) {
      getTaskWithHash(item.dataset.elementid).isDone = false;
      saveToLocalStorage("categoryList");
    }
  });
}

function setDoneCheckboxStyle() {
  document.querySelectorAll('[type="checkbox"]').forEach((item) => {
    if (item.checked) {
      let getItemParent = item.parentNode.parentNode;
      switch (getItemParent.dataset.priority) {
        case "HIGH":
          getItemParent.classList.remove("bg-red-800");
          break;
        case "MED":
          getItemParent.classList.remove("bg-orange-200");

          break;
        case "LOW":
          getItemParent.classList.remove("bg-green-700");
          break;
      }
      getItemParent.classList.add("bg-gray-300");
    } else {
      let getItemParent = item.parentNode.parentNode;
      getItemParent.classList.remove("bg-gray-300");

      switch (getItemParent.dataset.priority) {
        case "HIGH":
          getItemParent.classList.add("bg-red-800");
          break;
        case "MED":
          getItemParent.classList.add("bg-orange-200");

          break;
        case "LOW":
          getItemParent.classList.add("bg-green-700");
          break;
        default:
          break;
      }
    }
  });
}
document
  .querySelectorAll('[data-buttonevent="deleteCheckedboxes"]')
  .forEach((item) => {
    item.addEventListener("click", deleteCheckedboxes);
  });
function deleteCheckedboxes() {
  document.querySelectorAll('[type="checkbox"]').forEach((item) => {
    if (item.checked) {
      getActiveTasks().splice(getTaskWithHash(item.dataset.elementid), 1);
      updateUIForTasks();
      saveToLocalStorage("categoryList");
    }
  });
}

export {
  updateUIForCategories,
  getActiveCategoryDOMelement,
  addNewInput,
  removeFormElement,
  switchToClickedCategory,
  scrollToActiveCategory,
  addEditInput,
  clickOnAddNewTask,
  updateUIForTasks,
};
