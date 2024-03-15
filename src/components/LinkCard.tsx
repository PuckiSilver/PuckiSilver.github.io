import React from 'react'
import './LinkCard.scss'

const LinkCard = ({ title, description, link, image, internal }: { title:string, description:string, link:string, image:string, internal?:boolean }) => {
    return (
        <a
            className='linkCard'
            href={link}
            target={internal ? '_self' : '_blank'}
            rel={internal ? '' : 'noreferrer'}
        >
            <img
                className='backgroundImage'
                src={image}
                alt={`${title}BackgroundImage`}
            />
            <h3>{title}</h3>
            <p>{description}</p>
        </a>
    )
}

export default LinkCard
