import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './index.css';
import PrivateRoute from './services/PrivateRoute';
import App from './components/App';
import Header from './components/header';
import Connect from './components/connect';
import ScannerStudent from './components/scannerStudent';

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Header />
      <Routes>
        <Route path="/app" element={
          <PrivateRoute>
            <App />
          </PrivateRoute>
        } />
      <Route path="/connect" element={<Connect />} />
      <Route path="/" element={<ScannerStudent />} />
    </Routes>
  </Router>
  </React.StrictMode >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();