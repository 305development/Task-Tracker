import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const BASE_URL = 'http://localhost:5001';

function TaskApp() {
    const [tasks, setTasks] = useState([]);
    const [modal, setModal] = useState({ open: false, type: '', taskId: null });
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Load tasks from the server
        const fetchTasks = async () => {
            try {
                const response = await fetch(`${BASE_URL}/tasks`);
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                setMessage('Error fetching tasks: ' + error.message);
            }
        };
        fetchTasks();
    }, []);

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
