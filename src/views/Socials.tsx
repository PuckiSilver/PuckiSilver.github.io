import React from 'react'
import './Socials.scss'
import LinkCard from '../components/LinkCard'
import GitHubLogo from '../icons/github'
import ModrinthLogo from '../icons/modrinth'
import DiscordLogo from '../icons/discord'
import PayPalLogo from '../icons/paypal'
import PlanetMinecraftLogo from '../icons/planetminecraft'

const Socials = () => {
    return (
        <main className='socials'>
            <h1>Socials</h1>
            <div className='section'>
                <h2>Download my Packs</h2>
                <div className='grid'>
                    <LinkCard
                        title='Modrinth'
                        description='A versioned history for most of my packs'
                        link='https://modrinth.com/user/PuckiSilver'
                        icon={<ModrinthLogo/>}
                    />
                    <LinkCard
                        title='Planet Minecraft'
                        description='All packs, including jam packs and one-offs'
                        link='https://www.planetminecraft.com/member/puckisilver/'
                        icon={<PlanetMinecraftLogo/>}
                    />
                    <LinkCard
                        title='GitHub'
                        description='Source code for my packs and additional libraries and resources'
                        link='https://github.com/ps-dps'
                        icon={<GitHubLogo/>}
                    />
                </div>
            </div>
            <div className='section'>
                <h2>Other Socials</h2>
                <div className='grid'>
                    <LinkCard
                        title='GitHub'
                        description='My personal GitHub account with other projects and contributions'
                        link='https://github.com/PuckiSilver'
                        icon={<GitHubLogo/>}
                    />
                    <LinkCard
                        title='Paypal'
                        description='Support me with a donation'
                        link='https://paypal.me/puckisilver'
                        icon={<PayPalLogo/>}
                    />
                    <LinkCard
                        title='Discord'
                        description='Add me on Discord if you need help with my stuff or want to chat'
                        link='https://discord.com/users/346300510581817354'
                        icon={<DiscordLogo/>}
                    />
                </div>
            </div>
        </main>
    )
}

export default Socials
