export default class BaseEntity {
  constructor(title = "Title", description = "Description") {
    this.title = title;
    this.description = description;
  }

  editTitle(newTitle) {
    this.title = newTitle;
  }
  editDescription(newDescription) {
    this.description = newDescription;
  }
}
