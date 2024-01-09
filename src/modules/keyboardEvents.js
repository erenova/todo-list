import { getActiveCategory, setActiveCategoryByIndex } from "./category";
import { updateUIForCategories } from "./dynamicUI";

document.addEventListener("keydown", (e) => {
  let num = getActiveCategory().index;
  if (e.code === "ArrowUp" && num !== 0) {
    setActiveCategoryByIndex(getActiveCategory().index - 1);
    updateUIForCategories();
  }
  if (e.code === "ArrowDown") {
    setActiveCategoryByIndex(getActiveCategory().index + 1);
    updateUIForCategories();
  }
});
