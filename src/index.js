import "./main.css";
import "./modules/category";
import "./modules/task";
import * as UIelements from "./modules/UI";
import * as categoryModule from "./modules/category";
import * as taskModule from "./modules/task";
import backgroundPhoto from "./imgs/todo-background.png";
import { updateAssetURLs } from "./modules/assetManagement";

document.addEventListener("DOMContentLoaded", () => {
  UIelements.setFiltersDOMrequirements();
  updateAssetURLs();
  UIelements.updateActiveFilterImageOnLoad();
});

document.body.style.backgroundImage = `url(${backgroundPhoto})`;
function developmentHelper(item, naming) {
  window[`${naming}`] = item;
}

developmentHelper(categoryModule, "category");
developmentHelper(taskModule, "task");
developmentHelper(UIelements, "UIelements");

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("contextmenu", (event) => event.preventDefault());
    img.addEventListener("pointerdown", (event) => event.preventDefault());
  });
});
