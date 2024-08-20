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
    const taskList = document.getElementById('tasks');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${task.title}</strong>
            <p>${task.description}</p>
            <p>Due Date: ${new Date(task.dueDate).toLocaleDateString()}</p>
            <button onclick="editTask('${task.id}')">Edit</button>
            <button onclick="deleteTask('${task.id}')">Delete</button>
        `;
        taskList.appendChild(li);
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
        taskForm.reset();
        document.getElementById('taskId').value = '';
        fetchTasks();
    } catch (error) {
        console.error('Error saving task:', error);
    }
}

async function deleteTask(id) {
    try {
        await fetch(`http://localhost:5001/tasks/${id}`, {
            method: 'DELETE',
        });
        fetchTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

function editTask(id) {
    fetch(`http://localhost:5001/tasks/${id}`)
        .then(response => response.json())
        .then(task => {
            document.getElementById('taskId').value = task.id;
            document.getElementById('title').value = task.title;
            document.getElementById('description').value = task.description;
            document.getElementById('dueDate').value = task.dueDate.slice(0, 10); // Format for date input
        })
        .catch(error => console.error('Error fetching task for editing:', error));
}
