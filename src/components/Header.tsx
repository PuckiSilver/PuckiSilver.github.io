import React from 'react'
import './Header.scss'

const routes = [
    { path: '/', name: 'Home' },
    { path: '/socials', name: 'Socials' },
    { path: '/faq', name: 'FAQ' },
];

const Header = () => {
    const selectedRoute = window.location.pathname;

    return (
        <header>
            <h1>
                <a href="/">
                    <span className='full'>PuckiSilver</span>
                    <span className='short'>PS</span>
                </a>
            </h1>
            <nav>
                <ul>
                    {routes.map(route => (
                        <li key={route.path}>
                            <a href={route.path} className={selectedRoute === route.path ? 'selected' : undefined}>
                                {route.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    )
}

export default Header
