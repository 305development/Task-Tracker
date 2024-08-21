document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const messageContainer = document.getElementById('messageContainer');
    const BASE_URL = 'http://localhost:5001';  // Ensure this matches your server's port

    // Create and add modal elements
    const modal = document.createElement('div');
    modal.classList.add('modal');
    document.body.appendChild(modal);

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modal.appendChild(modalContent);

    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');
    modalContent.appendChild(modalHeader);

    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');
    modalContent.appendChild(modalBody);

    const modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');
    modalContent.appendChild(modalFooter);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    modalHeader.appendChild(closeButton);

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.style.display = 'none';
    modalFooter.appendChild(saveButton);

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

    // Show modal for editing task
    function showEditModal(taskElement, id) {
        const title = taskElement.querySelector('.taskTitle').textContent;
        const description = taskElement.querySelector('.taskDescription').textContent;
        modalHeader.innerHTML = '<h2>Edit Task</h2>';
        modalBody.innerHTML = `
            <label for="editTitle">Title:</label>
            <input type="text" id="editTitle" value="${title}"><br>
            <label for="editDescription">Description:</label>
            <textarea id="editDescription">${description}</textarea><br>
        `;
        saveButton.style.display = 'inline';
        saveButton.onclick = () => {
            const newTitle = document.getElementById('editTitle').value;
            const newDescription = document.getElementById('editDescription').value;
            fetch(`${BASE_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTitle, description: newDescription })
            })
            .then(response => response.json())
            .then(updatedTask => {
                taskElement.querySelector('.taskTitle').textContent = updatedTask.title;
                taskElement.querySelector('.taskDescription').textContent = updatedTask.description;
                displayMessage('Task updated successfully.', 'success');
                modal.style.display = 'none';
            })
            .catch(error => {
                console.error(error);
                displayMessage('Error updating task: ' + error, 'error');
            });
        };
        modal.style.display = 'flex';
    }

    // Show modal for deleting task
    function showDeleteModal(taskElement, id) {
        modalHeader.innerHTML = '<h2>Confirm Deletion</h2>';
        modalBody.innerHTML = `
            <p>Do you want to delete this task?</p>
            <button id="deleteForeverButton">Delete Forever</button>
            <button id="cancelDeleteButton">Cancel</button>
        `;
        saveButton.style.display = 'none';

        document.getElementById('deleteForeverButton').onclick = () => {
            fetch(`${BASE_URL}/tasks/${id}`, { method: 'DELETE' })
                .then(() => {
                    taskElement.remove();
                    displayMessage('Task deleted permanently.', 'success');
                    modal.style.display = 'none';
                })
                .catch(error => {
                    console.error(error);
                    displayMessage('Error deleting task: ' + error, 'error');
                });
        };

        document.getElementById('cancelDeleteButton').onclick = () => {
            displayMessage('Task deletion canceled.', 'info');
            modal.style.display = 'none';
        };

        modal.style.display = 'flex';
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

    // Show modal for setting reminder
    function showReminderModal(taskElement, id) {
        const existingReminder = taskElement.querySelector('.taskReminder').textContent;
        const dueDate = taskElement.querySelector('.taskDueDate').textContent;
        modalHeader.innerHTML = '<h2>Set Reminder</h2>';
        modalBody.innerHTML = `
            <label for="reminderText">Reminder Text:</label>
            <input type="text" id="reminderText" value="${existingReminder.replace('Reminder: ', '')}"><br>
            <label for="alarmTime">Alarm Time (HH:MM, 24-hour format):</label>
            <input type="text" id="alarmTime" value="${dueDate.split(" ")[1]}">
        `;
        saveButton.style.display = 'inline';
        saveButton.onclick = () => {
            const reminder = document.getElementById('reminderText').value;
            const alarmTime = document.getElementById('alarmTime').value;
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
                        displayMessage(`Reminder: ${updatedTask.reminder}`, 'info');
                    }, timeDifference);
                }
                modal.style.display = 'none';
            })
            .catch(error => {
                console.error(error);
                displayMessage('Error setting reminder: ' + error, 'error');
            });
        };
        modal.style.display = 'flex';
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

    // Create Task Element function
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
            <button onclick="showEditModal(this.parentElement, '${task._id}')">Edit</button>
            <button onclick="showDeleteModal(this.parentElement, '${task._id}')">Delete</button>
            <button onclick="markTaskComplete('${task._id}', this.parentElement)">Mark Complete</button>
            <button onclick="showReminderModal(this.parentElement, '${task._id}')">Set Reminder</button>
        `;
        return taskElement;
    }

    // Initial load
    loadTasks();
});
