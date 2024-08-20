document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const messageContainer = document.getElementById('messageContainer');
    const BASE_URL = 'http://localhost:5001';  // Make sure this matches your server's port

    // Load tasks from the server
    function loadTasks() {
        fetch(`${BASE_URL}/tasks`)
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = '';
                tasks.forEach(task => {
                    const taskElement = createTaskElement(task);
                    taskList.appendChild(taskElement);
                });
            })
            .catch(error => {
                console.error(error);
                displayMessage('Error fetching tasks: ' + error, 'error');
            });
    }

    // Add a new task
    document.getElementById('addTaskButton').addEventListener('click', () => {
        const name = document.getElementById('taskName').value;
        const note = document.getElementById('taskNote').value;
        const created = document.getElementById('taskCreated').value;
        const due = document.getElementById('taskDue').value;

        if (name && created && due) {
            const task = { name, note, createdAt: created, dueDate: due, completed: false, reminder: null };
            fetch(`${BASE_URL}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task)
            })
            .then(response => response.json())
            .then(savedTask => {
                const taskElement = createTaskElement(savedTask);
                taskList.appendChild(taskElement);
                taskForm.reset();  // Clear the form fields
            })
            .catch(error => {
                console.error(error);
                displayMessage('Error adding task: ' + error, 'error');
            });
        } else {
            displayMessage('Please fill in all required fields.', 'error');
        }
    });

    // Edit a task
    function editTask(id) {
        const name = prompt("New task name:");
        if (name) {
            fetch(`${BASE_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            })
            .then(response => response.json())
            .then(updatedTask => {
                loadTasks(); // Reload tasks to reflect changes
            })
            .catch(error => {
                console.error(error);
                displayMessage('Error updating task: ' + error, 'error');
            });
        }
    }

    // Delete a task
    function deleteTask(id) {
        fetch(`${BASE_URL}/tasks/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            loadTasks(); // Reload tasks after deletion
        })
        .catch(error => {
            console.error(error);
            displayMessage('Error deleting task: ' + error, 'error');
        });
    }

    // Mark task as complete
    function markTaskComplete(id) {
        fetch(`${BASE_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: true })
        })
        .then(response => response.json())
        .then(updatedTask => {
            loadTasks(); // Reload tasks to reflect changes
        })
        .catch(error => {
            console.error(error);
            displayMessage('Error updating task status: ' + error, 'error');
        });
    }

    // Set a reminder for a task
    function setReminder(id) {
        const reminder = prompt("Reminder text:");
        if (reminder) {
            fetch(`${BASE_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reminder })
            })
            .then(response => response.json())
            .then(updatedTask => {
                loadTasks(); // Reload tasks to reflect changes
            })
            .catch(error => {
                console.error(error);
                displayMessage('Error setting reminder: ' + error, 'error');
            });
        }
    }

    // Display message in the UI
    function displayMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.style.display = 'block';
        messageContainer.style.backgroundColor = type === 'error' ? '#ffcccb' : '#d4edda';
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 3000);
    }

    // Create a task element
    function createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.className = 'task';

        const taskInfo = document.createElement('div');
        taskInfo.textContent = `${task.name} - ${task.createdAt} - ${task.dueDate}`;
        if (task.completed) {
            taskInfo.style.textDecoration = 'line-through';
        }

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editTask(task.id));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTask(task.id));

        const completeButton = document.createElement('button');
        completeButton.textContent = task.completed ? 'Unmark Complete' : 'Mark Complete';
        completeButton.addEventListener('click', () => markTaskComplete(task.id));

        const reminderButton = document.createElement('button');
        reminderButton.textContent = 'Set Reminder';
        reminderButton.addEventListener('click', () => setReminder(task.id));

        taskElement.appendChild(taskInfo);
        taskElement.appendChild(editButton);
        taskElement.appendChild(deleteButton);
        taskElement.appendChild(completeButton);
        taskElement.appendChild(reminderButton);

        return taskElement;
    }

    loadTasks();
});
