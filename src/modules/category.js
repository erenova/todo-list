import BaseEntity from "./baseEntity";

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

const categorySettings = {
  activeCategory: { hashID: undefined, index: undefined },
  allCategories: [],
  getCategoryCount() {
    return this.allCategories.length;
  },
  getActiveCategory() {
    return this.activeCategory;
  },
  getAllCategories() {
    return this.allCategories;
  },
};

function createNewCategory(title, description) {
  /* Single responsibility principle */
  return new Category(title, description);
}

function resetIndexForCategories() {
  /* For tracking categories */
  let categoryIndex = 0;
  categorySettings.allCategories.forEach((item) => {
    item.index = categoryIndex;
    categoryIndex++;
  });
}

function addNewCategory(title, description) {
  /* Single responsibility principle */
  let newCategory = createNewCategory(title, description);
  categorySettings.allCategories.push(newCategory);
  /* Track latest added category */
  resetIndexForCategories();
  setActiveCategory(newCategory);
}

function setActiveCategory(activeCategoryValues) {
  categorySettings.activeCategory.hashID = activeCategoryValues.hash;
  categorySettings.activeCategory.index = activeCategoryValues.index;
}

function deleteCategory(itemIndex) {
  if (itemIndex === getCategoryCount()) {
  }
  categorySettings.allCategories.splice(itemIndex, 1);
  resetIndexForCategories();
}

function getCategoryCount() {
  return categorySettings.allCategories.length;
}

function getActiveCategory() {
  return categorySettings.activeCategory;
}

function getAllCategories() {}

export {
  categorySettings,
  addNewCategory,
  deleteCategory,
  getActiveCategory,
  getAllCategories,
};
