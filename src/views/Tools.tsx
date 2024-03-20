import React from 'react'
import LinkCard from '../components/LinkCard'
import './Tools.scss'

const Tools = () => {
    return (
        <main className='tools'>
            <div className='section'>
                <h1>Tools</h1>
                <div className='grid'>
                    <LinkCard
                        title='FanCIT Pants'
                        description='Create custom armor textures that work with CIT and vanilla Minecraft'
                        link='/tools/fancit-pants'
                        image='https://raw.githubusercontent.com/misode/mcmeta/assets/assets/minecraft/textures/item/diamond_leggings.png'
                        internal
                    />
                    <LinkCard
                        title='Cardboard'
                        description='Package data packs and resource packs into mods for all conventional mod loaders'
                        link='/tools/cardboard'
                        image='https://raw.githubusercontent.com/misode/mcmeta/assets/assets/minecraft/textures/item/diamond_leggings.png'
                        internal
                    />
                </div>
            </div>
        </main>
    )
}

export default Tools