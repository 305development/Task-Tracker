const express = require('express');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // For unique task IDs

// Initialize the Express app
const app = express();

// Use CORS middleware to handle requests from different origins
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Define the port
const port = process.env.PORT || 5001;  // Using port 5001

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for root requests
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// In-memory storage for tasks
const tasks = [];

// Get all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
    const task = { id: uuidv4(), ...req.body }; // Add a unique ID to each task
    tasks.push(task);
    res.status(201).json(task);
});

// Update an existing task
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const index = tasks.findIndex(task => task.id === id);
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...req.body };
        res.json(tasks[index]);
    } else {
        res.status(404).send('Task not found');
    }
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const index = tasks.findIndex(task => task.id === id);
    if (index !== -1) {
        tasks.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Task not found');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
