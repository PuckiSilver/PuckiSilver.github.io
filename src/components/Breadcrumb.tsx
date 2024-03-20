import React from 'react'
import './Breadcrumb.scss'

const Breadcrumb = ({ path }: { path: { name: string, link: string }[] }) => {
    return (
        <div className='breadcrumb'>
            {path.map((item, index) => (<>
                <span key={index}>
                    <a href={item.link}>{item.name}</a>
                </span>
                {index < path.length - 1 ? (
                    <span key={index + '_'}>
                        &gt;
                    </span>
                ) : (null)}</>
            ))}
        </div>
    )
}

export default Breadcrumb