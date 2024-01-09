import BaseEntity from "./baseEntity";
import compareAsc from "date-fns/compareAsc";
import { PriorityLevels } from "./task";
import { v4 as uuidv4 } from "uuid";
class Category extends BaseEntity {
  constructor(title) {
    super(title);
    this.tasks = [];
    this.hash = uuidv4();
  }
}

let categorySettings = decideCategoryState();
categorySettings.activeCategory = {
  hashID: undefined,
  index: undefined,
  title: undefined,
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
    case `recentFilter`:
      localStorage.setItem(`recentFilter`, recentUsedFilter);

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
        tasks: undefined,
      },
      allCategories: [
        {
          title: "Example Category",
          tasks: [],
          hash: uuidv4(),
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

//! vv--- Filtering ---vv */

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
    addDoneItemsToTheBottom();
    saveToLocalStorage("categoryList");
  } else {
    console.warn("No Such Filter!");
  }
}
let reverseOrderTitle = true;
function toggleNameFilterTask(isSame) {
  recentUsedFilter = "nameFilter";
  saveToLocalStorage("recentFilter");
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
  saveToLocalStorage("recentFilter");

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
let reverseOrderPriority = false;
function togglePriorityFilterTask() {
  recentUsedFilter = "priorityFilter";
  saveToLocalStorage("recentFilter");
  let finalList = [];
  let highList = [];
  let medList = [];
  let lowList = [];
  let copyActiveTasks = [...getActiveTasks()];
  copyActiveTasks.forEach((item) => {
    switch (item.priority) {
      /* HIGH */
      case PriorityLevels[0]:
        highList.push(item);
        break;
      /* MED */
      case PriorityLevels[1]:
        medList.push(item);
        break;
      /* LOW */
      case PriorityLevels[2]:
        lowList.push(item);
        break;
    }
  });
  finalList = [...highList, ...medList, ...lowList];
  if (reverseOrderPriority) {
    finalList.reverse();
    reverseOrderPriority = false;
  } else {
    reverseOrderPriority = true;
  }
  categorySettings.activeCategory.tasks = finalList;
  return getActiveTasks();
}

function getActiveFilterName() {
  return `${recentUsedFilter}`;
}

function isFilterDescending(filterName) {
  let filterObjects = {
    nameFilter: reverseOrderTitle,
    dateFilter: reverseOrderDate,
    priorityFilter: reverseOrderPriority,
  };

  return { isDescending: filterObjects[filterName], filterName };
}

function addDoneItemsToTheBottom() {
  let doneItems = getActiveTasks().filter((item) => item.isDone);
  let notDoneItems = getActiveTasks().filter((item) => !item.isDone);
  getActiveCategory().tasks = notDoneItems.concat(doneItems);
}

//! ^^--- Filtering ---^^ */

/* VV--- ADD ---VVV */
function createNewCategory(title) {
  /* SRP */
  return new Category(title);
}

function addNewCategory(title = "Category Name") {
  /* SRP */
  let newCategory = createNewCategory(title);
  categorySettings.allCategories.push(newCategory);
  /* Track latest added category */
  resetIndex(categorySettings.allCategories);
  setActiveCategoryByReference(newCategory);
  saveToLocalStorage(`latestIndex`, getCategoryCount() - 1);
  saveToLocalStorage("categoryList");
}

function resetIndex(arrayList, isDomArray) {
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
function setActiveCategoryByHash(hashID) {
  const categoryByHash = getCategoryByHash(hashID);
  categorySettings.activeCategory = categoryByHash;
  saveToLocalStorage(`latestIndex`, categoryByHash.index);
  saveToLocalStorage("categoryList");
}

/* VV--- REMOVE ---VV */
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

function deleteAllActiveTasks() {
  categorySettings.activeCategory.tasks = [];
  saveToLocalStorage("categoryList");
}

function deleteAllCategories() {
  categorySettings.allCategories = [createNewCategory("Example Category")];
  resetIndex(categorySettings.allCategories);

  saveToLocalStorage("categoryList");
}

/* ^^--- REMOVE ---^^ */

/* Get-Find */

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

function getCategoryByHash(hashID) {
  const foundCategory = categorySettings.allCategories.find((item) => {
    return item.hash === hashID;
  });

  if (foundCategory) {
    return foundCategory;
  } else {
    console.warn("Böyle bir kategori bulunamadı.");
    return false;
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
  toggleDateFilterTask,
  togglePriorityFilterTask,
  useFilter,
  useActiveFilter,
  deleteAllActiveTasks,
  deleteAllCategories,
  getActiveFilterName,
  isFilterDescending,
  getCategoryByHash,
  setActiveCategoryByHash,
  uuidv4,
  addDoneItemsToTheBottom,
};
