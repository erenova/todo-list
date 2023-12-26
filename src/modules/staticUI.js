import { updateAssetURLs } from "./assetManagement";
import { getActiveFilterName, isFilterDescending, useFilter } from "./category";

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
//close
function closeActiveModal() {
  let allModalElements = document.querySelectorAll("[data-modalstatus]");
  allModalElements.forEach((modalItem) => {
    modalItem.classList.add("hidden");
  });
}
//open clearAll

function openModal() {
  let allModalElements = document.querySelectorAll("[data-modalstatus]");
  allModalElements.forEach((modalItem) => {
    modalItem.classList.remove("hidden");
    modalItem.classList.add("flex");
  });
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

// clear all task button click
document
  .querySelector('[data-buttonEvent="clearAllTasks"]')
  .addEventListener("click", openModal);

// clear modal on backdrop click
document.querySelector("#backdrop").addEventListener("click", closeActiveModal);

// clear all task modal, on click to cancel
document
  .querySelector('[data-buttonEvent="deleteAllTasks"]')
  .addEventListener("click", closeActiveModal);

// clear all task modal, on click to cancel
document
  .querySelector('[data-buttonEvent="cancelModal"]')
  .addEventListener("click", closeActiveModal);

export {
  resetActiveFilterStatus,
  setActiveFilterText,
  setFiltersDOMrequirements,
  resetImages,
  updateActiveFilterImage,
  updateActiveFilterImageOnLoad,
};
