import React from 'react'
import LinkCard from '../components/LinkCard'

const Tools = () => {
    return (
        <main className='tools'>
            <h1>Tools</h1>
            <LinkCard
                title='FanCIT Pants'
                description='Create custom armor textures that work with CIT and vanilla Minecraft'
                link='/tools/fancit-pants'
                image='https://raw.githubusercontent.com/misode/mcmeta/assets/assets/minecraft/textures/item/diamond_leggings.png'
                internal
            />
        </main>
    )
}

export default Tools