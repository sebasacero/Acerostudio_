import React from 'react';
import { createRoot } from 'react-dom/client';
import '../../css/volumetrico.css';
import '../../css/app.css';
import './app-react.css';
import App from './App.jsx';

createRoot(document.getElementById('raiz')).render(<React.StrictMode><App /></React.StrictMode>);
