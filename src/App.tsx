import React, { useEffect } from 'react';
import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './views/Home';
import Faq from './views/Faq';
import Contact from './views/Contact';
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
import Games from './views/Games';
import GamepadIcon from './icons/gamepad';

const App = () => {
  const [navActive, setNavActive] = React.useState(() => {
    const navActive = localStorage.getItem('navActive');
    return navActive ? JSON.parse(navActive) : false;
  });
  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'ps-dark');
  const [isSelectingTheme, setIsSelectingTheme] = React.useState(false);
  const themeSelectRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('navActive', navActive.toString());
  }, [navActive]);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutsideThemeSelect = (e: MouseEvent) => {
      if (themeSelectRef.current && !themeSelectRef.current.contains(e.target as Node)) {
        setIsSelectingTheme(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutsideThemeSelect);
    return () => window.removeEventListener('mousedown', handleClickOutsideThemeSelect);
  }, []);

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
          <div className={`theme_select${isSelectingTheme ? ' is_selecting_theme' : ''}`} ref={themeSelectRef}>
            <button className='selected' onClick={() => setIsSelectingTheme(b => !b)}>
              <div className={theme} />
            </button>
            {isSelectingTheme && (
              <div className='theme_select_popup'>
                {theme !== 'ps-dark' && <button onClick={() => {
                  setTheme('ps-dark');
                  setIsSelectingTheme(false);
                }}>
                  <div className='ps-dark' />
                </button>}
                {theme !== 'ps-light' && <button onClick={() => {
                  setTheme('ps-light');
                  setIsSelectingTheme(false);
                }}>
                  <div className='ps-light' />
                </button>}
                {theme !== 'trans' && <button onClick={() => {
                  setTheme('trans');
                  setIsSelectingTheme(false);
                }}>
                  <div className='trans' />
                </button>}
                {theme !== 'enby' && <button onClick={() => {
                  setTheme('enby');
                  setIsSelectingTheme(false);
                }}>
                  <div className='enby' />
                </button>}
              </div>
            )}
          </div>
        </div>
      </header>
      <nav className={navActive ? 'active' : undefined}>
        <div className='navbar_section'>
          {[
            getNavItem('/', 'Home', <HomeIcon/>),
            getNavItem('/faq', 'Faq', <InfoIcon/>),
            getNavItem('/tools', 'Tools', <HammerIcon/>),
            getNavItem('/games', 'Games', <GamepadIcon/>),
            getNavItem('/contact', 'Contact', <MessageIcon/>),
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
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/games" element={<Games />} />

            <Route path="/tools/velvet" element={<Velvet />} />
            <Route path="/tools/cardboard" element={<Cardboard />} />

            <Route path="/g/survive" element={<Survive />} />
          </Routes>
        </BrowserRouter>
        <footer>
          <a href='https://github.com/PuckiSilver/PuckiSilver.github.io/blob/main/LICENSE' target='_blank' rel='noreferrer'>Licensed under MIT</a>
        </footer>
      </div>
    </div>
  );
}

export default App;
