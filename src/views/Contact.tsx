import React from 'react'
import LinkCard from '../components/LinkCard'
import GitHubLogo from '../icons/github'
import ModrinthLogo from '../icons/modrinth'
import DiscordLogo from '../icons/discord'
import PayPalLogo from '../icons/paypal'
import PlanetMinecraftLogo from '../icons/planetminecraft'
import EnvelopeIcon from '../icons/envelope'
import KofiIcon from '../icons/kofi'

const Contact = () => {
    return (
        <main className='contact'>
            <h1>Contact</h1>
            <div className='section'>
                <h2>Reporting Issues with Projects</h2>
                <p>If you have found an issue or have any other inquiry about a specific project, please report it directly on the respective platform</p>
                <div className='grid'>
                    <LinkCard
                        title='Modrinth'
                        description={<>You can't report anything here but every project has a <b>link to it's issue tracker</b></>}
                        link='https://modrinth.com/user/PuckiSilver'
                        icon={<ModrinthLogo/>}
                    />
                    <LinkCard
                        title='GitHub'
                        description={<>All issues are handled in the <b>issues</b> section of the respective repository</>}
                        link='https://github.com/ps-dps'
                        icon={<GitHubLogo/>}
                    />
                    <LinkCard
                        title='Planet Minecraft'
                        description={<>You can also leave a <b>comment</b> underneath the project's page</>}
                        link='https://planetminecraft.com/m/PuckiSilver'
                        icon={<PlanetMinecraftLogo/>}
                    />
                </div>
            </div>
            <div className='section'>
                <h2>Reach me directly</h2>
                <div className='grid'>
                    <LinkCard
                        title='Discord'
                        description={<>Send me a <b>message request</b> on Discord to quickly reach me directly</>}
                        link='https://discord.com/users/346300510581817354'
                        icon={<DiscordLogo/>}
                    />
                    <LinkCard
                        title='E-mail'
                        description={<>Feel free to send an email to <b>pucki.silver@gmail.com</b> for anything more formal</>}
                        link='mailto:pucki.silver@gmail.com'
                        icon={<EnvelopeIcon/>}
                    />
                </div>
            </div>
            <div className='section'>
                <h2>Support me monetarily</h2>
                <div className='grid'>
                    <LinkCard
                        title='Ko-fi'
                        description='If you like my work, consider donating'
                        link='https://ko-fi.com/puckisilver'
                        icon={<KofiIcon/>}
                    />
                    <LinkCard
                        title='Paypal'
                        description='If you like my work, consider donating'
                        link='https://paypal.me/puckisilver'
                        icon={<PayPalLogo/>}
                    />
                </div>
            </div>
        </main>
    )
}

export default Contact
