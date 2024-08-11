import React from 'react'
import './Home.scss'
import LinkCard from '../components/LinkCard'
import HammerIcon from '../icons/hammer'
import InfoIcon from '../icons/info'
import MessageIcon from '../icons/message'

export default function Home() {
    return (
        <main className='home'>
            <div className='title'>
                <h3>Welcome to my website, I'm</h3>
                <h1 className='fancyName'>PuckiSilver</h1>
            </div>
            <div className='section'>
                <h2>Explore the Website</h2>
                <div className='grid'>
                    <LinkCard
                        title='Socials'
                        description='Find me on various platforms'
                        link='/socials'
                        icon={<MessageIcon/>}
                    />
                    <LinkCard
                        title='FAQ'
                        description='Answers to the most frequently asked questions'
                        link='/faq'
                        icon={<InfoIcon/>}
                    />
                    <LinkCard
                        title='Tools'
                        description='Tools and resources for Minecraft Data Pack development'
                        link='/tools'
                        icon={<HammerIcon/>}
                    />
                </div>
            </div>
        </main>
    )
}
