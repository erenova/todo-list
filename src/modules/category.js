import BaseEntity from "./baseEntity";
import compareAsc from "date-fns/compareAsc";
import compareDesc from "date-fns/compareDesc";
import { format } from "./task";
import { get } from "lodash";
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

let categorySettings = decideCategoryState();
categorySettings.activeCategory = {
  hashID: undefined,
  index: undefined,
  title: undefined,
  description: undefined,
  tasks: undefined,
};
/* vv-- LocalStorage --vv */

function saveToLocalStorage(item, numberValue) {
  switch (item) {
    case `categoryList`:
      localStorage.setItem(`categoryList`, JSON.stringify(categorySettings));

      break;
    case `latestIndex`:
      localStorage.setItem(`latestIndex`, numberValue);
      break;
    case `lastFilter`:
      localStorage.setItem(`filterSetting`, recentUsedFilter);

      break;
  }
}

function decideCategoryState() {
  if (localStorage.getItem("categoryList") === null) {
    return {
      activeCategory: {
        hashID: undefined,
        index: undefined,
        title: undefined,
        description: undefined,
        tasks: undefined,
      },
      allCategories: [
        {
          title: "Example Category",
          description: "Category Description",
          tasks: [],
          hash: crypto.randomUUID(),
          index: 0,
        },
      ],
    };
  } else {
    return JSON.parse(localStorage.getItem("categoryList"));
  }
}

function openLatestPage() {
  let status = localStorage.getItem("latestIndex");
  if (status !== null && categorySettings.allCategories[status] !== undefined) {
    setActiveCategoryByIndex(status);
  } else {
    console.warn("Welcome New User");
    setActiveCategoryByIndex(0);
  }
}

/* ^^-- LocalStorage --^^ */

/* vv--- Filtering ---vv */

let recentUsedFilter = getFilterOnLoad();
window.addEventListener("DOMContentLoaded", () => {
  useFilter(recentUsedFilter);
});
function getFilterOnLoad() {
  let lastFilter = localStorage.getItem("recentFilter");
  if (lastFilter !== null) {
    return lastFilter;
  } else {
    localStorage.setItem("recentFilter", "nameFilter");

    return "nameFilter";
  }
}
function useActiveFilter(isSame) {
  useFilter(recentUsedFilter, isSame);
}

function useFilter(filterName = "nameFilter", isSame) {
  let filters = {
    nameFilter: toggleNameFilterTask,
    dateFilter: toggleDateFilterTask,
    priorityFilter: togglePriorityFilterTask,
  };
  if (typeof filters[filterName] === typeof filters[filterName]) {
    filters[filterName](isSame);
    saveToLocalStorage("categoryList");
  } else {
    console.warn("No Such Filter!");
  }
}
let reverseOrderTitle = true;
function toggleNameFilterTask(isSame) {
  recentUsedFilter = "nameFilter";
  if (isSame === true) {
    if (!reverseOrderTitle) {
      getActiveTasks().sort((itemA, itemB) => {
        let newA = itemA.title.toLowerCase();
        let newB = itemB.title.toLowerCase();
        if (newA > newB) return 1;
        if (newA < newB) return -1;
        return 0;
      });
    } else {
      getActiveTasks().sort((itemA, itemB) => {
        let newA = itemA.title.toLowerCase();
        let newB = itemB.title.toLowerCase();
        if (newA > newB) return -1;
        if (newA < newB) return 1;
        return 0;
      });
    }
  } else {
    if (reverseOrderTitle) {
      getActiveTasks().sort((itemA, itemB) => {
        let newA = itemA.title.toLowerCase();
        let newB = itemB.title.toLowerCase();
        if (newA > newB) return 1;
        if (newA < newB) return -1;
        return 0;
      });
      reverseOrderTitle = false;
      return;
    } else {
      getActiveTasks().sort((itemA, itemB) => {
        let newA = itemA.title.toLowerCase();
        let newB = itemB.title.toLowerCase();
        if (newA > newB) return -1;
        if (newA < newB) return 1;
        return 0;
      });
      reverseOrderTitle = true;
      return;
    }
  }
}
let reverseOrderDate = false;
function toggleDateFilterTask(isSame) {
  recentUsedFilter = "dateFilter";
  if (isSame) {
    if (!reverseOrderDate) {
      getActiveTasks().sort((itemA, itemB) => {
        let newA = new Date(itemA.dueDate);
        let newB = new Date(itemB.dueDate);

        return compareAsc(newA, newB);
      });
    } else {
      getActiveTasks().sort((itemA, itemB) => {
        let newA = new Date(itemA.dueDate);
        let newB = new Date(itemB.dueDate);

        return compareAsc(newB, newA);
      });
    }
  } else {
    if (reverseOrderDate) {
      reverseOrderDate = false;
      getActiveTasks().sort((itemA, itemB) => {
        let newA = new Date(itemA.dueDate);
        let newB = new Date(itemB.dueDate);

        return compareAsc(newA, newB);
      });
    } else {
      reverseOrderDate = true;
      getActiveTasks().sort((itemA, itemB) => {
        let newA = new Date(itemA.dueDate);
        let newB = new Date(itemB.dueDate);

        return compareAsc(newB, newA);
      });
    }
  }
}
function togglePriorityFilterTask() {
  recentUsedFilter = "priorityFilter";
}

/* ^^--- Filtering ---^^ */

function createNewCategory(title, description) {
  /* SRP */
  return new Category(title, description);
}

function addNewCategory(
  title = "Category Name",
  description = "Category Description"
) {
  /* SRP */
  let newCategory = createNewCategory(title, description);
  categorySettings.allCategories.push(newCategory);
  /* Track latest added category */
  resetIndex(categorySettings.allCategories);
  setActiveCategoryByReference(newCategory);
  saveToLocalStorage(`latestIndex`, getCategoryCount() - 1);
  saveToLocalStorage("categoryList");
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
  saveToLocalStorage("categoryList");
}

function setActiveCategoryByIndex(NewactiveCategoryValues) {
  if (NewactiveCategoryValues < getCategoryCountAsIndex()) {
    categorySettings.activeCategory =
      getAllCategories()[NewactiveCategoryValues];
    saveToLocalStorage(`latestIndex`, NewactiveCategoryValues);
  } else {
    categorySettings.activeCategory =
      getAllCategories()[getCategoryCountAsIndex()];
    saveToLocalStorage(`latestIndex`, getCategoryCountAsIndex());
  }
  saveToLocalStorage("categoryList");
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
    addNewCategory();
    setActiveCategoryByIndex(0);
  }

  resetIndex(categorySettings.allCategories);
  saveToLocalStorage("categoryList");
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

openLatestPage();

export {
  reverseOrderTitle,
  categorySettings,
  recentUsedFilter,
  addNewCategory,
  deleteCategory,
  getActiveCategory,
  getAllCategories,
  setActiveCategoryByIndex,
  setActiveCategoryByReference,
  getActiveTasks,
  resetIndex,
  saveToLocalStorage,
  toggleNameFilterTask,
  compareAsc,
  compareDesc,
  useFilter,
  useActiveFilter,
};
