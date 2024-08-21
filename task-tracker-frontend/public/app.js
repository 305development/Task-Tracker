document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
    
    const taskForm = document.getElementById('taskForm');
    taskForm.addEventListener('submit', handleFormSubmit);
});

async function fetchTasks() {
    try {
        const response = await fetch('http://localhost:5001/tasks');
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const id = document.getElementById('taskId').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('dueDate').value;
    
    const taskData = { title, description, dueDate };
    
    try {
        if (id) {
            // Update task
            await fetch(`http://localhost:5001/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData),
            });
        } else {
            // Add new task
            await fetch('http://localhost:5001/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData),
            });
        }
        
        // Clear form and fetch updated tasks
        document.getElementById('taskForm').reset();
        document.getElementById('taskId').value = '';
        fetchTasks();
    } catch (error) {
        console.error('Error saving task:', error);
    }
}

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
