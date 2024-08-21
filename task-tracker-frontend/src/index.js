import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

// Modal Component
const Modal = ({ isOpen, onClose, onSave, task, onDelete, onSetReminder }) => {
    if (!isOpen) return null;

    const handleSave = () => {
        onSave(task);
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{task ? 'Edit Task' : 'New Task'}</h2>
                    <button className="close" onClick={onClose}>Close</button>
                </div>
                <div className="modal-body">
                    <input type="hidden" id="taskId" value={task ? task._id : ''} />
                    <label>
                        Title:
                        <input type="text" id="title" defaultValue={task ? task.title : ''} />
                    </label>
                    <label>
                        Description:
                        <textarea id="description" defaultValue={task ? task.description : ''}></textarea>
                    </label>
                    <label>
                        Due Date:
                        <input type="date" id="dueDate" defaultValue={task ? task.dueDate.split('T')[0] : ''} />
                    </label>
                    <label>
                        Reminder:
                        <input type="text" id="reminder" defaultValue={task ? task.reminder : ''} />
                    </label>
                </div>
                <div className="modal-footer">
                    {task && <button onClick={() => onDelete(task._id)}>Delete</button>}
                    <button onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

// Main App Component
const MainApp = () => {
    const [tasks, setTasks] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:5001/tasks');
            const tasks = await response.json();
            setTasks(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleSave = async (task) => {
        const taskId = document.getElementById('taskId').value;
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const dueDate = document.getElementById('dueDate').value;
        const reminder = document.getElementById('reminder').value;

        const taskData = { title, description, dueDate, reminder };

        try {
            if (taskId) {
                await fetch(`http://localhost:5001/tasks/${taskId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData),
                });
            } else {
                await fetch('http://localhost:5001/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData),
                });
            }
            fetchTasks();
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    const handleDelete = async (taskId) => {
        try {
            await fetch(`http://localhost:5001/tasks/${taskId}`, { method: 'DELETE' });
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleSetReminder = (taskId) => {
        // Implement reminder logic here
    };

    return (
        <div>
            <h1>Task Tracker</h1>
            <button onClick={() => { setCurrentTask(null); setModalOpen(true); }}>Add New Task</button>
            <ul id="taskList">
                {tasks.map(task => (
                    <li key={task._id} className="taskElement">
                        <div className="taskInfo">
                            <h3 className="taskTitle">{task.title}</h3>
                            <p className="taskDescription">{task.description}</p>
                            <p className="taskDueDate">Due Date: {new Date(task.dueDate).toLocaleString()}</p>
                            <p className="taskReminder">Reminder: {task.reminder || 'None'}</p>
                        </div>
                        <button onClick={() => { setCurrentTask(task); setModalOpen(true); }}>Edit</button>
                        <button onClick={() => handleDelete(task._id)}>Delete</button>
                        <button onClick={() => handleSetReminder(task._id)}>Set Reminder</button>
                    </li>
                ))}
            </ul>
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                task={currentTask}
                onDelete={handleDelete}
                onSetReminder={handleSetReminder}
            />
        </div>
    );
};

// Render React App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);

reportWebVitals();
