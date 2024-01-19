import React from 'react'
import './Header.scss'

const routes = [
    { path: '/', name: 'Home' },
    { path: '/links', name: 'Linklist' },
    { path: '/faq', name: 'FAQ' },
];

export default function Header() {
    const selectedRoute = window.location.pathname;

    return (
        <header>
            <h1>
                <a href="/">
                    PuckiSilver
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
