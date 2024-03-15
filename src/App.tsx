import React from 'react';
import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Links from './views/Links';
import Home from './views/Home';
import Faq from './views/Faq';

function App() {
  return (
    <div className="wrapper">
      <Header />
      <div className="content">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}  />
            <Route path="/links" element={<Links />} />
            <Route path="/faq" element={<Faq />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
