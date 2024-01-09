import "./main.css";
import "./modules/category";
import "./modules/task";
import "./modules/dynamicUI";
import "./modules/keyboardEvents";
import * as UIelements from "./modules/staticUI";
import backgroundPhoto from "./imgs/todo-background.png";
import { updateAssetURLs } from "./modules/assetManagement";
import {
  scrollToActiveCategory,
  updateUIForCategories,
} from "./modules/dynamicUI";

document.body.style.backgroundImage = `url(${backgroundPhoto})`;

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
  scrollToActiveCategory();
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
); //
