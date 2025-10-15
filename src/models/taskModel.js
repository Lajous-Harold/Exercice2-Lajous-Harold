/* Task Model 
    A task is defined by a title and an optional description.
*/

class Task {
  // Initialize a new Task with title and a description (by default, an empty string)
  constructor(title, description = "") {
    this.title = title;
    this.description = description;
  }
}

module.exports = Task;
