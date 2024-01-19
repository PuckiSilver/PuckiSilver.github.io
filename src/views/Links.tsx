import React from 'react'
import './Links.scss'

export default function Links() {
    return (
        <main className='links'>
            <div className='section'>
                <h2>Minecraft Projects:</h2>
                <ul>
                    <li><a href="https://modrinth.com/user/PuckiSilver">PuckiSilver on Modrinth</a></li>
                    <li><a href="https://github.com/ps-dps">PS-DPS on GitHub</a></li>
                    <li><a href="https://planetminecraft.com/m/PuckiSilver">PuckiSilver on PlanetMinecraft</a></li>
                </ul>
            </div>
            <div className='section'>
                <h2>Other Projects:</h2>
                <ul>
                    <li><a href="https://github.com/PuckiSilver">PuckiSilver on GitHub</a></li>
                </ul>
            </div>
            <div className='section'>
                <h2>Donations:</h2>
                <ul>
                    <li><a href="https://paypal.me/puckisilver">PuckiSilver on PayPal</a></li>
                </ul>
            </div>
        </main>
    )
}
