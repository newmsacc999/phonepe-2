import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Optional: Add styles if needed
import './main.css'; // Main CSS
import App from './App';

// Rendering the App component into the root element
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
