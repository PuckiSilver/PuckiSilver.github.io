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
import DiscordLogo from './icons/discord';
import ModrinthLogo from './icons/modrinth';
import PlanetMinecraftLogo from './icons/planetminecraft';
import HammerIcon from './icons/hammer';
import HomeIcon from './icons/home';
import InfoIcon from './icons/info';
import MessageIcon from './icons/message';
import ArrowUpRightIcon from './icons/arrow-up-right';
import Survive from './views/games/Survive';

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
    const isExternal: boolean = link.startsWith('http');
    return (
      <a href={link} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noreferrer' : undefined}>
        {icon}
        <div className='info'>
          <span>{name}</span>
          {isExternal && <ArrowUpRightIcon/>}
        </div>
        <div className='info_hover'>
          <span>{name}</span>
          {isExternal && <ArrowUpRightIcon/>}
        </div>
      </a>
    );
  };

  return (
    <div className='layout'>
      <header>
        <div className='header_left'>
          <button onClick={() => setNavActive(!navActive)}>
            <img src="https://avatars.githubusercontent.com/u/84644295?v=4&s=128" alt="logo" />
          </button>
          <a href="/" className="name">
            <h1 className='full'>PuckiSilver</h1>
            <h1 className='short'>PS</h1>
          </a>
        </div>
        <div className='header_right'>
          <a href='https://discord.com/users/346300510581817354' target='_blank' rel='noreferrer'>
            <DiscordLogo/>
            <span>Discord</span>
          </a>
          <a href='https://planetminecraft.com/m/PuckiSilver' target='_blank' rel='noreferrer'>
            <PlanetMinecraftLogo/>
            <span>PMC</span>
          </a>
          <a href='https://modrinth.com/user/PuckiSilver' target='_blank' rel='noreferrer'>
            <ModrinthLogo/>
            <span>Modrinth</span>
          </a>
          <a href='https://github.com/PuckiSilver' target='_blank' rel='noreferrer'>
            <GithubLogo/>
            <span>GitHub</span>
          </a>
        </div>
      </header>
      <nav className={navActive ? 'active' : undefined}>
        <div className='navbar_section'>
          {[
            getNavItem('/', 'Home', <HomeIcon/>),
            getNavItem('/faq', 'Faq', <InfoIcon/>),
            getNavItem('/tools', 'Tools', <HammerIcon/>),
            getNavItem('/socials', 'Socials', <MessageIcon/>),
          ]}
        </div>
        <div className='navbar_section'>
          {[
            getNavItem('https://github.com/PuckiSilver/PuckiSilver.github.io', 'Page Source', <GithubLogo/>),
          ]}
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

            <Route path="/g/survive" element={<Survive />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
