import React from 'react';
import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './views/Home';
import Faq from './views/Faq';
import Socials from './views/Socials';

const App = () => {
  return (
    <div className="wrapper">
      <Header />
      <div className="content">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}  />
            <Route path="/faq" element={<Faq />} />
            <Route path="/socials" element={<Socials />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
