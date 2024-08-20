const express = require('express');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

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

// Placeholder for task routes (GET, POST, PUT, DELETE requests)
let tasks = []; // Simple in-memory storage for tasks

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const task = { id: uuidv4(), ...req.body }; // Add unique ID to task
    tasks.push(task);
    res.status(201).json(task);
});

app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const updatedTask = req.body;
    tasks = tasks.map(task => (task.id === id ? { ...task, ...updatedTask } : task));
    res.json(updatedTask);
});

app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    tasks = tasks.filter(task => task.id !== id);
    res.status(204).end();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
