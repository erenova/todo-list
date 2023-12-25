import { updateAssetURLs } from "./assetManagement";
import {
  categorySettings,
  getActiveFilterName,
  isFilterDescending,
  useFilter,
} from "./category";

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

/* vvv Document Event listener section vvv */
document
  .querySelector(`#filterList`)
  .addEventListener("click", handleClickEventOnFilter);

export {
  resetActiveFilterStatus,
  setActiveFilterText,
  setFiltersDOMrequirements,
  resetImages,
  updateActiveFilterImage,
  updateActiveFilterImageOnLoad,
};
