import React, { useState, useEffect } from 'react';

const BASE_URL = 'http://localhost:5001';

function TaskApp() {
    const [tasks, setTasks] = useState([]);
    const [modal, setModal] = useState({ open: false, type: '', taskId: null });
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        dueDate: '',
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    async function fetchTasks() {
        try {
            const response = await fetch(`${BASE_URL}/tasks`);
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            setMessage('Error fetching tasks: ' + error.message);
        }
    }

    async function handleFormSubmit(event) {
        event.preventDefault();
        const { id, title, description, dueDate } = formData;
        const taskData = { title, description, dueDate };

        try {
            if (id) {
                // Update task
                await fetch(`${BASE_URL}/tasks/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData),
                });
            } else {
                // Add new task
                await fetch(`${BASE_URL}/tasks`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData),
                });
            }
            setFormData({ id: '', title: '', description: '', dueDate: '' });
            fetchTasks();
        } catch (error) {
            setMessage('Error saving task: ' + error.message);
        }
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
    }

    function showEditModal(taskId) {
        const task = tasks.find(task => task._id === taskId);
        if (task) {
            setFormData({ id: task._id, title: task.title, description: task.description, dueDate: task.dueDate });
            setModal({ open: true, type: 'edit', taskId });
        }
    }

    function showDeleteModal(taskId) {
        setModal({ open: true, type: 'delete', taskId });
    }

    const handleDelete = async () => {
        try {
            await fetch(`${BASE_URL}/tasks/${modal.taskId}`, { method: 'DELETE' });
            setTasks(tasks.filter(task => task._id !== modal.taskId));
            setMessage('Task deleted permanently.');
        } catch (error) {
            setMessage('Error deleting task: ' + error.message);
        }
        setModal({ open: false, type: '', taskId: null });
    };

    const handleCloseModal = () => {
        setModal({ open: false, type: '', taskId: null });
    };

    return (
        <div>
            {message && <div className="message">{message}</div>}
            <form id="taskForm" onSubmit={handleFormSubmit}>
                <input type="hidden" name="id" value={formData.id} />
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Task Title" required />
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Task Description" required />
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
                <button type="submit">Save Task</button>
            </form>
            <ul id="taskList">
                {tasks.map(task => (
                    <li key={task._id}>
                        <div className="taskElement">
                            <div className="taskInfo">
                                <h3 className="taskTitle">{task.title}</h3>
                                <p className="taskDescription">{task.description}</p>
                                <p className="taskDueDate">Due Date: {new Date(task.dueDate).toLocaleString()}</p>
                            </div>
                            <button onClick={() => showEditModal(task._id)}>Edit</button>
                            <button onClick={() => showDeleteModal(task._id)}>Delete</button>
                            {/* Implement Mark Complete and Set Reminder as needed */}
                        </div>
                    </li>
                ))}
            </ul>
            {modal.open && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{modal.type === 'delete' ? 'Confirm Deletion' : 'Edit Task'}</h2>
                        {modal.type === 'delete' ? (
                            <>
                                <p>Do you want to delete this task?</p>
                                <button onClick={handleDelete}>Delete Forever</button>
                            </>
                        ) : (
                            <>
                                <p>Editing Task</p>
                                {/* Add any additional fields or information for editing here */}
                            </>
                        )}
                        <button onClick={handleCloseModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TaskApp; // Ensure this is the default export
