import "./main.css";
import "./modules/category";
import "./modules/task";
import * as categoryModule from "./modules/category";
import * as taskModule from "./modules/task";

function developmentHelper(item, naming) {
  window[`${naming}`] = item;
}

developmentHelper(categoryModule, "category");
developmentHelper(taskModule, "task");
