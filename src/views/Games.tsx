import React from 'react'
import LinkCard from '../components/LinkCard'
import GamepadIcon from '../icons/gamepad'

const Games = () => {
    return (
        <main className='games'>
            <h1>Games</h1>
            <div className='section'>
                <h2>Browser Games</h2>
                <div className='grid'>
                    <LinkCard
                        title='Survive!'
                        description='A small Vampire Survivors style game right here on the website'
                        link='/g/survive'
                        icon={<GamepadIcon />}
                        flag='in dev'
                    />
                    <LinkCard
                        title='Elden Ringdle'
                        description='A wordle inspired game with Elden Ring Weapons'
                        link='/g/eldenringdle'
                        icon={<GamepadIcon />}
                        flag='in dev'
                    />
                </div>
            </div>
        </main>
    )
}

export default Games