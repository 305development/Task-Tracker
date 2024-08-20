import React from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

function App() {
    const handleSaveTask = async (task) => {
        try {
            await fetch('http://localhost:5001/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task),
            });
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    return (
        <div>
            <h1>Task Tracker</h1>
            <TaskForm onSave={handleSaveTask} />
            <TaskList />
        </div>
    );
}

export default App; // Only one default export here
