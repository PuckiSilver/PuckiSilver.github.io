import React from 'react';
import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './views/Home';
import Faq from './views/Faq';
import Socials from './views/Socials';
import Tools from './views/Tools';
import Velvet from './views/tools/Velvet';
import Cardboard from './views/tools/Cardboard';

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

            <Route path="/tools/velvet" element={<Velvet />} />
            <Route path="/tools/cardboard" element={<Cardboard />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
