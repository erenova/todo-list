import "./main.css";
import "./modules/category";
import "./modules/task";
import * as UIelements from "./modules/staticUI";
import * as categoryModule from "./modules/category";
import * as taskModule from "./modules/task";
import backgroundPhoto from "./imgs/todo-background.png";
import { updateAssetURLs } from "./modules/assetManagement";

document.body.style.backgroundImage = `url(${backgroundPhoto})`;
function developmentHelper(item, naming) {
  window[`${naming}`] = item;
}
/* Final DOM Listeners */
document.addEventListener("DOMContentLoaded", () => {
  UIelements.setFiltersDOMrequirements();
  updateAssetURLs();
  UIelements.updateActiveFilterImageOnLoad();
});

developmentHelper(categoryModule, "category");
developmentHelper(taskModule, "task");
developmentHelper(UIelements, "UIelements");
