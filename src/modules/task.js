import BaseEntity from "./baseEntity";
import * as categoryModule from "./category";
import isValid from "date-fns/isValid";
import format from "date-fns/format";
class Task extends BaseEntity {
  constructor(title = "title", description = "description", dueDate, priority) {
    super(title, description);
    this.dueDate = dueDate;
    this.priority = priority;
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

const PriorityLevels = ["HIGH", "MED", "LOW"];

let fetchActiveTaskList = categoryModule.getActiveTasks;

function createNewTask(title, description, dueDate, priority) {
  return new Task(title, description, dueDate, priority);
}
function addNewTask(
  title,
  description,
  dueDate = new Date(),
  priority = "MED"
) {
  dueDate = new Date(dueDate);
  if (isValid(dueDate) && PriorityLevels.includes(priority)) {
    dueDate = format(dueDate, `yyyy-MM-dd`);
    fetchActiveTaskList().push(
      createNewTask(title, description, dueDate, priority)
    );
    categoryModule.useActiveFilter(true);
    categoryModule.saveToLocalStorage("categoryList");
  } else {
    console.warn("not Valid");
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

export { addNewTask, deleteTask, isValid, format };
