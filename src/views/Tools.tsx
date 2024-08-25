import React from 'react'
import './Tools.scss'
import LinkCard from '../components/LinkCard'
import BoxIcon from '../icons/box'
import ShieldIcon from '../icons/shield'

const Tools = () => {
    return (
        <main className='tools'>
            <h1>Tools</h1>
            <div className='section'>
                <h2>Scripts on GitHub</h2>
                <div className='grid'>
                    <LinkCard
                        title='Cardboard'
                        description='A tool to package minecraft data packs and resource packs to mods for various mod loaders'
                        link='https://github.com/PuckiSilver/Cardboard'
                        icon={<BoxIcon />}
                    />
                    <LinkCard
                        title='FancyPantsLite▶CIT'
                        description='A tool to convert minecraft vanilla custom armor to be used with mods'
                        link='https://github.com/PuckiSilver/FancyPantsLite-to-CIT'
                        icon={<ShieldIcon />}
                    />
                </div>
            </div>
        </main>
    )
}

export default Tools