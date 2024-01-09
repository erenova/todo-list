import { updateAssetURLs } from "./assetManagement";
import {
  deleteAllActiveTasks,
  deleteCategory,
  getActiveFilterName,
  isFilterDescending,
  useFilter,
} from "./category";
import {
  addEditInput,
  addNewInput,
  clickOnAddNewTask,
  removeFormElement,
  updateUIForCategories,
  updateUIForTasks,
} from "./dynamicUI";
function resetActiveFilterStatus() {
  document.querySelectorAll(`[data-status]`).forEach((item) => {
    item.dataset.status = "passive";
  });
  const activeTextSpan = document.querySelector(
    `[data-filterEvent="${getActiveFilterName()}"]>span>[data-status]`
  );

  activeTextSpan.dataset.status = "active";
}

function setActiveFilterText() {
  document.querySelectorAll(`[data-status="passive"]`).forEach((item) => {
    item.textContent = "";
  });
  document.querySelector(`[data-status="active"]`).textContent = "(Active)";
}

function setFiltersDOMrequirements() {
  resetActiveFilterStatus();
  setActiveFilterText();
}

function getClickedFilterName(event) {
  let parentList = event.target.closest("li");
  /* if clicked element is li and not "description" */
  if (parentList && parentList.dataset.filterevent !== "none") {
    /* get Filter Name */
    return parentList;
  } else {
    return false;
  }
}

function handleClickEventOnFilter(event) {
  let checkedEvent = getClickedFilterName(event);
  if (checkedEvent) {
    useFilter(checkedEvent.getAttribute("data-filterEvent"));
    updateActiveFilterImage(checkedEvent.querySelector("img"));
    setFiltersDOMrequirements();
    updateUIForTasks();
  }
}

function handleActiveImageOrderStatus(imgItem) {
  let currentFilterName = getActiveFilterName();
  if (isFilterDescending(currentFilterName).isDescending) {
    imgItem.dataset.dynamicurl = imgItem.dataset.dynamicurl.replace(
      /(Normal|Desc|Asc).svg/i,
      "Desc.svg"
    );
  } else {
    imgItem.dataset.dynamicurl = imgItem.dataset.dynamicurl.replace(
      /(Normal|Desc|Asc).svg/i,
      "Asc.svg"
    );
  }
}

function resetImages() {
  document
    .querySelectorAll(
      '[data-dynamicurl$="Asc.svg"], [data-dynamicurl$="Desc.svg"]'
    )
    .forEach((item) => {
      item.dataset.dynamicurl = item.dataset.dynamicurl.replace(
        /(Asc|Desc).svg/i,
        "Normal.svg"
      );
    });
}

function updateActiveFilterImage(imgItem) {
  resetImages();
  handleActiveImageOrderStatus(imgItem);
  updateAssetURLs();
}

function updateActiveFilterImageOnLoad() {
  let imageItem = document
    .querySelector(`[data-filterevent="${category.getActiveFilterName()}"]`)
    .querySelector("img");
  if (getActiveFilterName() === "nameFilter") {
    imageItem.dataset.dynamicurl = imageItem.dataset.dynamicurl.replace(
      /(Normal|Desc|Asc).svg/i,
      "Asc.svg"
    );
  } else {
    imageItem.dataset.dynamicurl = imageItem.dataset.dynamicurl.replace(
      /(Normal|Desc|Asc).svg/i,
      "Desc.svg"
    );
  }

  updateAssetURLs();
}

/* Modal Open-Close */

//open modal & category & backdrop

function openModalTab() {
  let modalTab = document.querySelector("#delete-item");
  modalTab.classList.add("flex");
  modalTab.classList.remove("hidden");
}
function openBackdrop() {
  let darkTab = document.querySelector("#backdrop");
  darkTab.classList.add("flex");
  darkTab.classList.remove("hidden");
}

function openCategoryTab() {
  document.querySelector("#category-tab").classList.remove("-translate-x-full");
}

function openAllModalElements() {
  openModalTab();
  openBackdrop();
}

function openAllCategoryElements(isDesktop) {
  let categoryTab = document.querySelector("#category-tab").classList;
  /* If clicked element is desktop button   */
  if (isDesktop.target.dataset.buttonmobile === undefined) {
    if (categoryTab.contains("-translate-x-full")) {
      openCategoryTab();
    } else {
      closeCategoryTab();
    }
  } else {
    openCategoryTab();
    openBackdrop();
  }
}

//close modal and backdrop

function closeModalTab() {
  let modalTab = document.querySelector("#delete-item");
  modalTab.classList.remove("flex");
  modalTab.classList.add("hidden");
}

function closeBackdrop() {
  let darkTab = document.querySelector("#backdrop");
  darkTab.classList.remove("flex");
  darkTab.classList.add("hidden");
}

function closeCategoryTab() {
  document.querySelector("#category-tab").classList.add("-translate-x-full");
}

function closeAllModalElements() {
  closeModalTab();
  closeBackdrop();
  closeCategoryTab();
}
/* add-delete category */
function deleteActiveCategoryDOM() {
  if (document.querySelector("form")) {
    removeFormElement();
  } else {
    deleteCategory();
  }
  updateUIForCategories();
}

/* vvv Document Event listener section vvv */
document
  .querySelector(`#filterList`)
  .addEventListener("click", handleClickEventOnFilter);

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("contextmenu", (event) => event.preventDefault());
    img.addEventListener("pointerdown", (event) => event.preventDefault());
  });
});

// clear modal on backdrop click
document
  .querySelector("#backdrop")
  .addEventListener("click", closeAllModalElements);

// clear all task button click
document
  .querySelectorAll('[data-buttonEvent="clearAllTasks"]')
  .forEach((buttonElem) => {
    buttonElem.addEventListener("click", openAllModalElements);
  });

//! clear all task modal, on click to Delete anyway
document
  .querySelector('[data-buttonEvent="deleteAllTasks"]')
  .addEventListener("click", () => {
    closeAllModalElements();
    deleteAllActiveTasks();
    updateUIForTasks();
  });

// clear all task modal, on click to cancel
document
  .querySelector('[data-buttonEvent="cancelModal"]')
  .addEventListener("click", closeAllModalElements);

/* open close category tab */
document
  .querySelectorAll('[data-buttonEvent="openAllCategoryElements"]')
  .forEach((item) => {
    item.addEventListener("click", openAllCategoryElements);
  });

/* add-delete category */
document
  .querySelector('[data-buttonEvent="addNewCategory"]')
  .addEventListener("click", addNewInput);

/* Edit */
document
  .querySelector('[data-buttonEvent="editCategoryName"]')
  .addEventListener("click", addEditInput);
/* Delete */
document
  .querySelector('[data-buttonEvent="deleteActiveCategory"]')
  .addEventListener("click", deleteActiveCategoryDOM);

/* add New Category */
document
  .querySelectorAll('[data-buttonEvent="ClickOnAddNewTask"]')
  .forEach((element) => {
    element.addEventListener("click", clickOnAddNewTask);
  });

export {
  resetActiveFilterStatus,
  setActiveFilterText,
  setFiltersDOMrequirements,
  resetImages,
  updateActiveFilterImage,
  updateActiveFilterImageOnLoad,
  openCategoryTab,
};
