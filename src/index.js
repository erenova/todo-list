import "./main.css";
import "./modules/category";
import "./modules/task";
import "./modules/dynamicUI";
import * as UIelements from "./modules/staticUI";
import * as categoryModule from "./modules/category";
import * as taskModule from "./modules/task";
import backgroundPhoto from "./imgs/todo-background.png";
import { updateAssetURLs } from "./modules/assetManagement";
import { updateUIForCategories } from "./modules/dynamicUI";

document.body.style.backgroundImage = `url(${backgroundPhoto})`;
function developmentHelper(item, naming) {
  window[`${naming}`] = item;
}
/* Final DOM Listeners */
window.addEventListener("load", () => {
  document.querySelector("html").style.visibility = "visible";
  document.querySelector("html").style.opacity = "1";
});

document.addEventListener("DOMContentLoaded", () => {
  updateUIForCategories();
  UIelements.setFiltersDOMrequirements();
  updateAssetURLs();
  UIelements.updateActiveFilterImageOnLoad();
});

/* Touch zoom in feature disabled */
window.addEventListener(
  "touchstart",
  function (event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  },
  { passive: false }
);

window.addEventListener(
  "touchend",
  function (event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  },
  { passive: false }
);

window.addEventListener(
  "touchmove",
  function (event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  },
  { passive: false }
);

developmentHelper(categoryModule, "category");
developmentHelper(taskModule, "task");
developmentHelper(UIelements, "UIelements");
