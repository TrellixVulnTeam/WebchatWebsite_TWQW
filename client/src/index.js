import React from 'react';
import ReactDOM from 'react-dom';
import App from './hub/login';
import Home from './hub/home';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/style.css'
import './styles/items.css'
const routs = (
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Navigate to='/hub/login' />} />
      <Route exact path="/hub/login" element={<App />} />
      <Route exact path="/hub/home" element={<Home />} />
    </Routes>
  </BrowserRouter>
);

ReactDOM.render(
  routs,
  document.getElementById('root')
);