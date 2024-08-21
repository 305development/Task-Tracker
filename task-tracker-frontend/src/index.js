import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import TaskApp from './App'; // Make sure the path is correct
import reportWebVitals from './reportWebVitals';

// Use TaskApp as the root component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TaskApp />
  </React.StrictMode>
);

reportWebVitals();
