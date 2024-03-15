import React from 'react'
import './ToolsHeader.scss'

const ToolsHeader = () => {
    return (
        <div className='toolsHeader'>
            <a href='/tools'>
                <img src='https://cdn-icons-png.flaticon.com/512/271/271220.png' alt='back arrow'/>
                <p>Back to tools</p>
            </a>
        </div>
    )
}

export default ToolsHeader