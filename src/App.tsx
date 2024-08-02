import React, { useEffect } from 'react';
import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './views/Home';
import Faq from './views/Faq';
import Socials from './views/Socials';
import Tools from './views/Tools';
import Velvet from './views/tools/Velvet';
import Cardboard from './views/tools/Cardboard';
import GithubLogo from './icons/github';
import HammerIcon from './icons/hammer';
import HomeIcon from './icons/home';
import InfoIcon from './icons/info';
import MessageIcon from './icons/message';

const App = () => {
  const [navActive, setNavActive] = React.useState(() => {
    const navActive = localStorage.getItem('navActive');
    return navActive ? JSON.parse(navActive) : false;
  });

  useEffect(() => {
    localStorage.setItem('navActive', navActive.toString());
  }, [navActive]);

  useEffect(() => {
    if (window.innerWidth / 16 <= 80) {
      setNavActive(false)
    };
  }, [window.location]);

  const getNavItem = (link: string, name: string, icon: any) => {
    return (
      <a href={link}>
        {icon}
        <span>{name}</span>
        <div className='info_hover'>
          <span>{name}</span>
        </div>
      </a>
    );
  };

  return (
    <div className='layout'>
      <header>
        <div className='header_left'>
          <button onClick={() => setNavActive(!navActive)}>
            <img src="https://avatars.githubusercontent.com/u/84644295?v=4&s=32" alt="logo" />
          </button>
          <a href="/" className="name">
            <h1 className='full'>PuckiSilver</h1>
            <h1 className='short'>PS</h1>
          </a>
        </div>
        <div className='header_right'>
          <a href='https://github.com/PuckiSilver/PuckiSilver.github.io' target='_blank' rel='noreferrer'>
            <GithubLogo/>
            <span>GitHub</span>
          </a>
        </div>
      </header>
      <nav className={navActive ? 'active' : undefined}>
        <div className='navbar_top'>
          {[
            getNavItem('/', 'Home', <HomeIcon/>),
            getNavItem('/faq', 'Faq', <InfoIcon/>),
            getNavItem('/tools', 'Tools', <HammerIcon/>),
            getNavItem('/socials', 'Socials', <MessageIcon/>),
          ]}
        </div>
        <div className='navbar_bottom'>
          
        </div>
      </nav>
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
