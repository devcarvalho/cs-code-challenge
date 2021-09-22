const taskInput = document.getElementById('new-task');
const addButton = document.getElementsByTagName('button')[0];
const incompleteTasksHolder = document.getElementById('incomplete-tasks');
const completedTasksHolder = document.getElementById('completed-tasks');

function taskHandler() {
  let editModeTaskName = null;

  function createNewTaskElement(taskString) {
    listItem = document.createElement('li');
    checkBox = document.createElement('input');
    label = document.createElement('label');
    editInput = document.createElement('input');
    editButton = document.createElement('button');
    deleteButton = document.createElement('button');

    checkBox.type = 'checkbox';
    editInput.type = 'text';
    editButton.innerText = 'Edit';
    editButton.className = 'edit';
    deleteButton.innerText = 'Delete';
    deleteButton.className = 'delete';
    label.innerText = taskString;

    listItem.appendChild(checkBox);
    listItem.appendChild(label);
    listItem.appendChild(editInput);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    return listItem;
  }

  addTask = function () {
    if (!taskInput.value) {
      return;
    }
    const listItemName = taskInput.value;
    listItem = createNewTaskElement(listItemName);
    incompleteTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);
    taskInput.value = '';

    // Update localStorage tasks list
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ name: listItemName, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  editTask = function () {
    const listItem = this.parentNode;
    const editInput = listItem.querySelector('input[type=text');
    const label = listItem.querySelector('label');
    const button = listItem.getElementsByTagName('button')[0];

    const containsClass = listItem.classList.contains('editMode');
    if (containsClass) {
      label.innerText = editInput.value;
      button.innerText = 'Edit';

      // Update localStorage tasks list
      const tasks = JSON.parse(localStorage.getItem('tasks'));
      tasks.map((task) => {
        if (editModeTaskName == task.name) {
          task.name = editInput.value;
        }
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
      editModeTaskName = null;
    } else {
      editModeTaskName = label.innerText;
      editInput.value = label.innerText;
      button.innerText = 'Save';
    }

    listItem.classList.toggle('editMode');
  };

  deleteTask = function () {
    const listItem = this.parentNode;
    const ul = listItem.parentNode;
    ul.removeChild(listItem);

    // Update localStorage tasks list
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.splice(
      tasks.indexOf(
        tasks.find(
          (task) => listItem.querySelector('label').innerText == task.name
        )
      ),
      1
    );
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  taskCompleted = function (e) {
    if (e.key && e.key !== 'Enter' && e.keyCode !== 13) {
      return;
    }
    const listItem = this.parentNode;
    listItem.querySelector('input[type=checkbox]').checked = true;
    completedTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskIncomplete);

    // Update localStorage task item
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.map((task) => {
      if (listItem.querySelector('label').innerText == task.name) {
        task.completed = true;
      }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  taskIncomplete = function (e) {
    if (e.key && e.key !== 'Enter' && e.keyCode !== 13) {
      return;
    }
    const listItem = this.parentNode;
    listItem.querySelector('input[type=checkbox]').checked = false;
    incompleteTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);

    // Update localStorage task item
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.map((task) => {
      if (listItem.querySelector('label').innerText == task.name) {
        task.completed = false;
      }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  return {
    createNewTaskElement,
    addTask,
    editTask,
    deleteTask,
    taskCompleted,
    taskIncomplete,
  };
}

const bindTaskEvents = (taskListItem, checkBoxEventHandler) => {
  const checkBox = taskListItem.querySelector('input[type=checkbox]');
  const editButton = taskListItem.querySelector('button.edit');
  const deleteButton = taskListItem.querySelector('button.delete');
  editButton.onclick = editTask;
  deleteButton.onclick = deleteTask;
  checkBox.onchange = checkBoxEventHandler;
  checkBox.onkeyup = checkBoxEventHandler;
};

// Get tasks from localStorage on app starts
const tasks = JSON.parse(localStorage.getItem('tasks'));
if (tasks && tasks.length)
  tasks.forEach((task) => {
    const listItemName = task.name;
    listItem = taskHandler().createNewTaskElement(listItemName);
    if (task.completed) {
      listItem.querySelector('input[type=checkbox]').checked = true;
      completedTasksHolder.appendChild(listItem);
    } else {
      incompleteTasksHolder.appendChild(listItem);
    }
  });

// Add event listeners
addButton.addEventListener('click', taskHandler().addTask);

for (let i = 0; i < incompleteTasksHolder.children.length; i++) {
  bindTaskEvents(
    incompleteTasksHolder.children[i],
    taskHandler().taskCompleted
  );
}

for (let i = 0; i < completedTasksHolder.children.length; i++) {
  bindTaskEvents(
    completedTasksHolder.children[i],
    taskHandler().taskIncomplete
  );
}
