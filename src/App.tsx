import React from 'react';
import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './views/Home';
import Faq from './views/Faq';
import Socials from './views/Socials';
import Tools from './views/Tools';
import FancitPants from './views/tools/FancitPants';

const App = () => {
  return (
    <div className="wrapper">
      <Header />
      <div className="content">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}  />
            <Route path="/socials" element={<Socials />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/tools" element={<Tools />} />

            <Route path="/tools/fancit-pants" element={<FancitPants />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
