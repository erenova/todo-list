import BaseEntity from "./baseEntity";

const categorySettings = {
  activeCategory: {
    hashID: undefined,
    index: undefined,
    title: undefined,
    description: undefined,
    tasks: undefined,
  },
  allCategories: [],
};

class Category extends BaseEntity {
  constructor(title, description) {
    super(title, description);
    this.tasks = [];
    this.hash = crypto.randomUUID();
  }
  clearTasks() {
    this.tasks = [];
  }
}

function createNewCategory(title, description) {
  /* SRP */
  return new Category(title, description);
}

function addNewCategory(title, description) {
  /* SRP */
  let newCategory = createNewCategory(title, description);
  categorySettings.allCategories.push(newCategory);
  /* Track latest added category */
  resetIndex(categorySettings.allCategories);
  setActiveCategoryByReference(newCategory);
}

function resetIndex(arrayList) {
  /* For tracking categories */
  let categoryIndex = 0;
  arrayList.forEach((item) => {
    item.index = categoryIndex;
    categoryIndex++;
  });
}

function setActiveCategoryByReference(NewactiveCategoryValues) {
  categorySettings.activeCategory = NewactiveCategoryValues;
}

function setActiveCategoryByIndex(NewactiveCategoryValues) {
  if (NewactiveCategoryValues < getCategoryCountAsIndex()) {
    categorySettings.activeCategory =
      getAllCategories()[NewactiveCategoryValues];
  } else {
    categorySettings.activeCategory =
      getAllCategories()[getCategoryCountAsIndex()];
  }
}

function deleteCategory() {
  let activeItemIndex = getActiveCategory("index");
  categorySettings.allCategories.splice(activeItemIndex, 1);
  /* If Categories sum is not zero */
  if (getCategoryCount() >= 1) {
    /* Then, if available, active Item can be previous item  */
    if (activeItemIndex - 1 !== -1) {
      setActiveCategoryByIndex(activeItemIndex - 1);
    } else {
      /* if not, set it as 0 */
      setActiveCategoryByIndex(0);
    }
  } else {
    /*
    TODO! Create an example category function with example tasks in it, (future task) */
    addNewCategory();
    setActiveCategoryByIndex(0);
  }

  resetIndex(categorySettings.allCategories);
}

function getCategoryCount() {
  return categorySettings.allCategories.length;
}
function getCategoryCountAsIndex() {
  return categorySettings.allCategories.length - 1;
}

function getActiveTasks() {
  return getActiveCategory()["tasks"];
}

function getActiveCategory(spec) {
  if (spec !== undefined) {
    return categorySettings.activeCategory[spec];
  } else {
    return categorySettings.activeCategory;
  }
}

function getAllCategories() {
  return categorySettings.allCategories;
}

addNewCategory("chchch", "arararara");
addNewCategory("tytyty", "yak");
addNewCategory("vyvy", "");
addNewCategory("xdasdf", "hahaha");
addNewCategory();

export {
  categorySettings,
  addNewCategory,
  deleteCategory,
  getActiveCategory,
  getAllCategories,
  setActiveCategoryByIndex,
  setActiveCategoryByReference,
  getActiveTasks,
  resetIndex,
};
