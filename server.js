
const express = require('express');
const path = require('path');

// 

const port = process.env.PORT || 5001;  // Change 5000 to 5001


// const app = express();

// const port = process.env.PORT || 5000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for root requests
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
