// main.tsx
import React from 'react';
import App from './App';
import './styles/global.css';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');

if (!container) {
    throw new Error("Root element not found");
}

const root = createRoot(container);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);