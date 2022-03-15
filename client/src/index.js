import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Home from './hub/home'
import { BrowserRouter, Routes, Route, link } from 'react-router-dom';

const routs = (
  <BrowserRouter>
    <Routes>
        <Route exact path="/" element={<App/>} />
        <Route exact path="hub/home" element={<Home/>}/>
    </Routes>
  </BrowserRouter>
);

ReactDOM.render(
    routs,
  document.getElementById('root')
);