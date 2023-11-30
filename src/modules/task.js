import BaseEntity from "./baseEntity";
import * as categoryModule from "./category";
class Task extends BaseEntity {
  constructor(title, description, dueDate, priority) {
    super(title, description);
    this.dueDate = dueDate;
    this.priority = priority;
  }

  editDueDate(newDueDate) {
    this.dueDate = newDueDate;
  }
  editPriority(newPriority) {
    this.priority = newPriority;
  }
  editCategory(changeCategory) {
    this.category = changeCategory;
  }
}

const PriorityLevels = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

function createNewTask(title, description, dueDate, priority) {
  return new Task(title, description, dueDate, priority);
}

function addNewTask(title, description, dueDate, priority) {
  let newTask = createNewTask(title, description, dueDate, priority);

  categoryModule.getActiveTasks().push(newTask);
  categoryModule.resetIndex(categoryModule.getActiveTasks());
  newTask.category = categoryModule.getActiveCategory("hash");
}

function deleteTask(index) {
  if (
    categoryModule.getActiveTasks().length === 0 ||
    categoryModule.getActiveTasks()[index] === undefined
  ) {
    console.warn("Task doesn't exist");
  } else {
    categoryModule.getActiveTasks().splice(index, 1);
  }
}

export { addNewTask, deleteTask };
