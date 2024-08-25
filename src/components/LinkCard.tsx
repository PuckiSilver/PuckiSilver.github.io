import React, { ReactElement } from 'react'
import './LinkCard.scss'
import ArrowUpRightIcon from '../icons/arrow-up-right';

const LinkCard = ({ title, description, link, icon }: { title:string, description:string|ReactElement, link:string, icon?:any }) => {
    const isExternal: boolean = link.startsWith('http');
    return (
        <a
            className='link_card'
            href={link}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noreferrer' : undefined}
        >
            <div className='link_card_title'>
                {icon}
                <h3>{title}</h3>
                {isExternal && <ArrowUpRightIcon/>}
            </div>
            <div className='link_card_description'>
                <span>{description}</span>
            </div>
        </a>
    )
}

export default LinkCard
