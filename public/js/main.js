// main/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const messageContainer = document.getElementById('messageContainer');
    const BASE_URL = 'http://localhost:3000';

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
            .catch(error => displayMessage('Error fetching tasks: ' + error, 'error'));
    }

    // Add a new task
    document.getElementById('addTaskButton').addEventListener('click', () => {
        const name = document.getElementById('taskName').value;
        const note = document.getElementById('taskNote').value;
        const created = document.getElementById('taskCreated').value;
        const due = document.getElementById('taskDue').value;

        if (name && created && due) {
            const task = { name, note, createdAt: created, dueDate: due };
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
            .catch(error => displayMessage('Error adding task: ' + error, 'error'));
        } else {
            displayMessage('Please fill in all required fields.', 'error');
        }
    });

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
        taskElement.textContent = `${task.name} - ${task.createdAt} - ${task.dueDate}`;
        return taskElement;
    }

    loadTasks();
});
