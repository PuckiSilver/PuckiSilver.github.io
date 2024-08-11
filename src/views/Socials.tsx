import React from 'react'
import './Socials.scss'
import LinkCard from '../components/LinkCard'

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
                        image='https://docs.modrinth.com/img/logo.svg'
                    />
                    <LinkCard
                        title='Planet Minecraft'
                        description='All packs, including jam packs and one-offs'
                        link='https://www.planetminecraft.com/member/puckisilver/'
                        image='https://www.planetminecraft.com/images/layout/themes/modern/planetminecraft_logo.png'
                    />
                    <LinkCard
                        title='GitHub'
                        description='Source code for my packs and additional libraries and resources'
                        link='https://github.com/ps-dps'
                        image='https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_960_720.png'
                    />
                    <LinkCard
                        title='Datapack Hub'
                        description='Currently not kept up-to-date'
                        link='https://datapackhub.net/user/PuckiSilver'
                        image='https://datapackhub.net/logos/dph.svg'
                    />
                    <LinkCard
                        title='Curseforge'
                        description='Currently not kept up-to-date'
                        link='https://www.curseforge.com/members/puckisilver/projects'
                        image='https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/159648c2-8de7-4641-a129-8d8c2d06bd9c/dee1zh0-f9e45f11-8ff2-4032-8215-72e54c647a9f.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzE1OTY0OGMyLThkZTctNDY0MS1hMTI5LThkOGMyZDA2YmQ5Y1wvZGVlMXpoMC1mOWU0NWYxMS04ZmYyLTQwMzItODIxNS03MmU1NGM2NDdhOWYucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.wn4Fh5d0umUScFS1C__kH_akHWyV0bK0EkHfSTb_B7M'
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
                        image='https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_960_720.png'
                    />
                    <LinkCard
                        title='Paypal'
                        description='Support me with a donation'
                        link='https://paypal.me/puckisilver'
                        image='https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-color.svg'
                    />
                    <LinkCard
                        title='Discord'
                        description='Add me on Discord if you need help with my stuff or want to chat'
                        link='https://discord.com/users/346300510581817354'
                        image='https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.svg'
                    />
                </div>
            </div>
        </main>
    )
}

export default Socials
