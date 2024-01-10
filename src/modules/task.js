import BaseEntity from "./baseEntity";
import * as categoryModule from "./category";
import isValid from "date-fns/isValid";
import format from "date-fns/format";
class Task extends BaseEntity {
  constructor(
    title = "title",
    description = "description",
    dueDate,
    priority,
    isDone
  ) {
    super(title, description);
    this.dueDate = dueDate;
    this.priority = priority;
    this.isDone = isDone;
    this.uniqueID = categoryModule.uuidv4();
  }

  editDueDate(newDueDate) {
    newDueDate = new Date(newDueDate);
    if (newDueDate !== undefined && isValid(new Date(newDueDate))) {
      newDueDate = format(newDueDate, "yyyy-MM-dd");
      this.dueDate = newDueDate;
      categoryModule.saveToLocalStorage("categoryList");
    } else {
      console.warn("Invalid Date");
    }
  }
  editPriority(newPriority) {
    if (Object.values(PriorityLevels).includes(newPriority)) {
      this.priority = newPriority;
      categoryModule.saveToLocalStorage("categoryList");
    } else {
      console.warn("Invalid priority level");
    }
  }
  editCategory(changeCategory) {
    this.category = changeCategory;
    categoryModule.saveToLocalStorage("categoryList");
  }
}

export const PriorityLevels = ["HIGH", "MED", "LOW"];

let fetchActiveTaskList = categoryModule.getActiveTasks;

function createNewTask(title, description, dueDate, priority, isDone) {
  return new Task(title, description, dueDate, priority, isDone);
}
function addNewTask(
  title,
  description,
  dueDate = new Date(),
  priority = "MED",
  isDone = false
) {
  dueDate = new Date(dueDate);
  priority = priority.toUpperCase();
  if (
    isValid(dueDate) &&
    PriorityLevels.includes(priority) &&
    (isDone === false || isDone === true)
  ) {
    dueDate = format(dueDate, `yyyy-MM-dd`);
    fetchActiveTaskList().push(
      createNewTask(title, description, dueDate, priority, isDone)
    );
    categoryModule.useActiveFilter(true);
    categoryModule.saveToLocalStorage("categoryList");
    return true;
  } else {
    return false;
  }
}

function deleteTask(index) {
  if (
    fetchActiveTaskList().length === 0 ||
    fetchActiveTaskList()[index] === undefined
  ) {
    console.warn("Task doesn't exist");
  } else {
    fetchActiveTaskList().splice(index, 1);
  }
  categoryModule.useFilter(categoryModule.recentUsedFilter, true);

  categoryModule.saveToLocalStorage("categoryList");
}

function getTaskWithHash(hashID) {
  const foundTask = fetchActiveTaskList().find((item) => {
    return item.uniqueID === hashID;
  });
  if (foundTask) {
    console.log(foundTask);
    return foundTask;
  } else {
    return false;
  }
}

function getCheckFilteredTasks() {
  let allItems = fetchActiveTaskList().filter((item) => {
    if (item.isDone === false) {
      return item.uniqueID;
    }
  });
  categoryModule.getActiveCategory().tasks = allItems;
  console.log(allItems);
}

function checkEveryTask() {
  let value = true;
  if (fetchActiveTaskList()[0].isDone === true) value = false;
  let allItems = fetchActiveTaskList().forEach((element) => {
    element.isDone = value;
  });
}

export {
  addNewTask,
  deleteTask,
  getTaskWithHash,
  getCheckFilteredTasks,
  checkEveryTask,
};
