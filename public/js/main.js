document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const messageContainer = document.getElementById('messageContainer');
    const BASE_URL = 'http://localhost:5001';  // Ensure this matches your server's port

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
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const dueDate = document.getElementById('dueDate').value;

        if (title && dueDate) {
            const task = { title, description, dueDate };
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
    function editTask(id, taskElement) {
        const title = prompt('Enter new task title:', taskElement.querySelector('.taskTitle').textContent);
        const description = prompt('Enter new task description:', taskElement.querySelector('.taskDescription').textContent);
        if (title) {
            fetch(`${BASE_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description })
            })
            .then(response => response.json())
            .then(updatedTask => {
                taskElement.querySelector('.taskTitle').textContent = updatedTask.title;
                taskElement.querySelector('.taskDescription').textContent = updatedTask.description;
                displayMessage('Task updated successfully.', 'success');
            })
            .catch(error => {
                console.error(error);
                displayMessage('Error updating task: ' + error, 'error');
            });
        }
    }

    // Delete a task with confirmation for permanent deletion
    function deleteTask(id, taskElement) {
        const confirmation = confirm("Do you want to delete this task?");
        if (confirmation) {
            const deleteForever = confirm("Are you sure you want to delete this task forever?");
            if (deleteForever) {
                fetch(`${BASE_URL}/tasks/${id}`, { method: 'DELETE' })
                    .then(() => {
                        taskElement.remove();
                        displayMessage('Task deleted permanently.', 'success');
                    })
                    .catch(error => {
                        console.error(error);
                        displayMessage('Error deleting task: ' + error, 'error');
                    });
            } else {
                displayMessage('Task deletion canceled.', 'info');
            }
        } else {
            displayMessage('Task deletion canceled.', 'info');
        }
    }

    // Mark task as complete
    function markTaskComplete(id, taskElement) {
        fetch(`${BASE_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: true })
        })
        .then(response => response.json())
        .then(updatedTask => {
            taskElement.querySelector('.taskInfo').style.textDecoration = 'line-through';
            displayMessage('Task marked as complete.', 'success');
        })
        .catch(error => {
            console.error(error);
            displayMessage('Error marking task as complete: ' + error, 'error');
        });
    }

    // Set a reminder with alarm functionality
    function setReminder(id, taskElement) {
        const existingReminder = taskElement.querySelector('.taskReminder').textContent;
        const reminder = prompt('Enter or edit reminder text:', existingReminder);
        const dueDate = taskElement.querySelector('.taskDueDate').textContent;
        const alarmTime = prompt('Enter alarm time (HH:MM, 24-hour format):', dueDate.split(" ")[1]);

        if (reminder && alarmTime) {
            fetch(`${BASE_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reminder, alarmTime })
            })
            .then(response => response.json())
            .then(updatedTask => {
                taskElement.querySelector('.taskReminder').textContent = `Reminder: ${updatedTask.reminder}`;
                displayMessage('Reminder set successfully.', 'success');

                // Alarm functionality
                const alarmDateTime = new Date(`${updatedTask.dueDate.split(" ")[0]} ${updatedTask.alarmTime}`);
                const currentTime = new Date();

                if (alarmDateTime > currentTime) {
                    const timeDifference = alarmDateTime - currentTime;
                    setTimeout(() => {
                        alert(`Reminder: ${updatedTask.reminder}`);
                    }, timeDifference);
                }
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
        taskElement.classList.add('taskElement');
        taskElement.innerHTML = `
            <div class="taskInfo">
                <h3 class="taskTitle">${task.title}</h3>
                <p class="taskDescription">${task.description}</p>
                <p class="taskDueDate">Due Date: ${new Date(task.dueDate).toLocaleString()}</p>
                <p class="taskReminder">Reminder: ${task.reminder || 'None'}</p>
            </div>
            <button onclick="editTask('${task._id}', this.parentElement)">Edit</button>
            <button onclick="deleteTask('${task._id}', this.parentElement)">Delete</button>
            <button onclick="markTaskComplete('${task._id}', this.parentElement)">Mark Complete</button>
            <button onclick="setReminder('${task._id}', this.parentElement)">Set Reminder</button>
        `;
        return taskElement;
    }

    window.editTask = editTask;
    window.deleteTask = deleteTask;
    window.markTaskComplete = markTaskComplete;
    window.setReminder = setReminder;

    loadTasks();
});
