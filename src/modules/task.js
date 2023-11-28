import BaseEntity from "./baseEntity";

class Task extends BaseEntity {
  constructor(title, description, dueDate, priority, category) {
    super(title, description);
    this.dueDate = dueDate;
    this.priority = priority;
    this.category = category;
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

export default function createNewTask(
  title,
  description,
  dueDate,
  priority,
  category
) {
  return new Task(title, description, dueDate, priority, category);
}
