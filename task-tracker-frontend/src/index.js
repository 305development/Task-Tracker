import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const BASE_URL = 'http://localhost:5001';  // Ensure this matches your server's port

function TaskApp() {
    const [tasks, setTasks] = useState([]);
    const [modal, setModal] = useState({ open: false, type: '', taskId: null });
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Load tasks from the server
        fetch(`${BASE_URL}/tasks`)
            .then(response => response.json())
            .then(data => setTasks(data))
            .catch(error => setMessage('Error fetching tasks: ' + error));
    }, []);

    function showDeleteModal(taskId) {
        setModal({
            open: true,
            type: 'delete',
            taskId
        });
    }

    function handleDelete() {
        fetch(`${BASE_URL}/tasks/${modal.taskId}`, { method: 'DELETE' })
            .then(() => {
                setTasks(tasks.filter(task => task._id !== modal.taskId));
                setMessage('Task deleted permanently.');
                setModal({ open: false, type: '', taskId: null });
            })
            .catch(error => {
                setMessage('Error deleting task: ' + error);
                setModal({ open: false, type: '', taskId: null });
            });
    }

    function handleCloseModal() {
        setModal({ open: false, type: '', taskId: null });
    }

    return (
        <div>
            {message && <div className="message">{message}</div>}
            <ul>
                {tasks.map(task => (
                    <li key={task._id}>
                        <span>{task.title}</span>
                        <button onClick={() => showDeleteModal(task._id)}>Delete</button>
                    </li>
                ))}
            </ul>
            {modal.open && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Confirm Deletion</h2>
                        <p>Do you want to delete this task?</p>
                        <button onClick={handleDelete}>Delete Forever</button>
                        <button onClick={handleCloseModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TaskApp />
  </React.StrictMode>
);

reportWebVitals();
