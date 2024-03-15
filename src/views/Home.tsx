import React from 'react'
import './Home.scss'
import LinkCard from '../components/LinkCard'

export default function Home() {
    return (
        <main className='home'>
            <div className='section'>
                <div className='title'>
                    <h3>Welcome to the Website of</h3>
                    <h1 className='fancyName'>PuckiSilver</h1>
                </div>
            </div>
            <div className='section'>
                <h1>Explore the Website</h1>
                <div className='grid'>
                    <LinkCard
                        title='Socials'
                        description='Find me on various platforms'
                        link='/socials'
                        image='https://docs.modrinth.com/img/logo.svg'
                        internal
                    />
                    <LinkCard
                        title='FAQ'
                        description='Frequently asked questions'
                        link='/faq'
                        image='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Icon-round-Question_mark.svg/240px-Icon-round-Question_mark.svg.png'
                        internal
                    />
                    <LinkCard
                        title='Tools'
                        description='Tools and resources for Minecraft Data Pack development'
                        link='/tools'
                        image='https://raw.githubusercontent.com/misode/mcmeta/assets/assets/minecraft/textures/item/diamond_leggings.png'
                        internal
                    />
                </div>
            </div>
        </main>
    )
}
