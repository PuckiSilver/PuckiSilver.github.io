import React, { useEffect } from 'react'
import './Home.scss'
import LinkCard from '../components/LinkCard'
import HammerIcon from '../icons/hammer'
import InfoIcon from '../icons/info'
import MessageIcon from '../icons/message'
import StarIcon from '../icons/star'
import DownloadIcon from '../icons/download'
import TypescripIcon from '../icons/typescript'
import PythonIcon from '../icons/python'
import JavaIcon from '../icons/java'
import MinecraftIcon from '../icons/minecraft'
import OpenglIcon from '../icons/opengl'
import ReactIcon from '../icons/react'
import VisualStudioIcon from '../icons/visual-studio'
import IntelliJIcon from '../icons/intellij'
import UnrealScriptIcon from '../icons/unrealscript'
import BeetIcon from '../icons/beet'
import PaintDotNetIcon from '../icons/paintdotnet'
import SpringBootIcon from '../icons/spring-boot'

export default function Home() {
    const [starCount, setStarCount] = React.useState<number|null>(null);
    const [keepDownloadCount, setKeepDownloadCount] = React.useState<number|null>(null);
    const [mobCapDownloadCount, setMobCapDownloadCount] = React.useState<number|null>(null);

    useEffect(() => {
        fetch('https://api.github.com/repos/PuckiSilver/NoShadow')
            .then(res => res.json())
            .then(data => setStarCount(data.stargazers_count));
    }, []);
    useEffect(() => {
        fetch('https://api.modrinth.com/v2/project/keep-some-inventory')
            .then(res => res.json())
            .then(data => setKeepDownloadCount(data.downloads));
    }, []);
    useEffect(() => {
        fetch('https://api.modrinth.com/v2/project/mob-captains')
            .then(res => res.json())
            .then(data => setMobCapDownloadCount(data.downloads));
    }, []);

    const formatNumber = (num: number) => {
        const roundedToHundreds = Math.round(num / 100) * 100;
        return roundedToHundreds.toString().replace(/(\d+)(\d)\d\d/g, "$1.$2k");
    }

    return (
        <main className='home'>
            <div className='title'>
                <h3>Welcome to my website, I'm</h3>
                <h1 className='fancyName'>PuckiSilver</h1>
            </div>
            <div className='section'>
                <h2>My Skills</h2>
                <p>I'm a professional full-stack web developer with a high interest in modding- and creating games in my free time</p>
                <h3>Fluent Programming Languages</h3>
                <div className='skill_container'>
                    <a className='skill' style={{color: '#3178C6'}} href='https://www.typescriptlang.org' target='_blank'>
                        <TypescripIcon/>
                        Typescript
                    </a>
                    <a className='skill' style={{color: '#FFE263'}} href='https://www.python.org' target='_blank'>
                        <PythonIcon/>
                        Python
                    </a>
                    <a className='skill' style={{color: '#52A535'}} href='https://datapack.wiki' target='_blank'>
                        <MinecraftIcon/>
                        MCFunction
                    </a>
                    <a className='skill' style={{color: '#F8981D'}} href='https://www.java.com' target='_blank'>
                        <JavaIcon/>
                        Java
                    </a>
                    <a className='skill' style={{color: '#5586A4'}} href='https://www.khronos.org/opengl/wiki/Core_Language_(GLSL)' target='_blank'>
                        <OpenglIcon/>
                        GLSL
                    </a>
                </div>
                <h3>Frameworks and Tools</h3>
                <div className='skill_container'>
                    <a className='skill' style={{color: '#22A7F2'}} href='https://code.visualstudio.com' target='_blank'>
                        <VisualStudioIcon/>
                        VSCode
                    </a>
                    <a className='skill' style={{color: '#E83464'}} href='https://www.jetbrains.com/idea/' target='_blank'>
                        <IntelliJIcon/>
                        IntelliJ IDEA
                    </a>
                    <a className='skill' style={{color: '#5ED3F3'}} href='https://react.dev' target='_blank'>
                        <ReactIcon/>
                        React
                    </a>
                    <a className='skill' style={{color: '#77BC1F'}} href='https://spring.io/projects/spring-boot' target='_blank'>
                        <SpringBootIcon/>
                        Spring Boot
                    </a>
                    <a className='skill' style={{color: '#6991D2'}} href='https://www.getpaint.net' target='_blank'>
                        <PaintDotNetIcon/>
                        Paint.NET
                    </a>
                    <a className='skill' style={{color: '#F7F7F7'}} href='https://www.unrealengine.com' target='_blank'>
                        <UnrealScriptIcon/>
                        Unreal Engine
                    </a>
                    <a className='skill' style={{color: '#B50E38'}} href='https://mcbeet.dev' target='_blank'>
                        <BeetIcon/>
                        Beet
                    </a>
                </div>
            </div>
            <div className='section'>
                <h2>Highlighted Projects</h2>
                <div className='project_stats'>
                    <StarIcon style={{color: '#ffdd00'}}/>
                    <span><a href='https://github.com/PuckiSilver/NoShadow' target='_blank'>NoShadow</a> with <span className='stat' style={{color: '#ffdd00'}}>{starCount ?? '36+'}</span> Stars on GitHub</span>
                </div>
                <div className='project_stats'>
                    <DownloadIcon style={{color: '#1cdf8b'}}/>
                    <span><a href='https://modrinth.com/project/mob-captains' target='_blank'>Mob Captains</a> with <span className='stat' style={{color: '#1cdf8b'}}>{mobCapDownloadCount ? formatNumber(mobCapDownloadCount) : '271.6k+'}</span> Downloads on Modrinth and</span>
                </div>
                <div className='project_stats'>
                    <DownloadIcon style={{color: '#1cdf8b'}}/>
                    <span><a href='https://modrinth.com/project/keep-some-inventory' target='_blank'>Keep Some Inventory</a> with <span className='stat' style={{color: '#1cdf8b'}}>{keepDownloadCount ? formatNumber(keepDownloadCount) : '251.3k+'}</span> Downloads on Modrinth</span>
                </div>
            </div>
            <div className='section'>
                <h2>Explore the Website</h2>
                <div className='grid'>
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
                    <LinkCard
                        title='Contact'
                        description='Find out how to contact or support me'
                        link='/contact'
                        icon={<MessageIcon/>}
                    />
                </div>
            </div>
        </main>
    )
}
