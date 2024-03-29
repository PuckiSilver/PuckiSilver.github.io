import React from 'react'
import Breadcrumb from '../../components/Breadcrumb'
import UploadMultiple from '../../components/UploadMultiple'

const Velvet = () => {
    return (
        <>
            <Breadcrumb path={[{ name: "Home", link: "/" }, { name: "Tools", link: "/tools" }, { name: "Velvet", link: "/tools/velvet" }]} />
            <main className='velvet'>
                <div className='section'>
                    <h1>Velvet</h1>
                    <p>Create custom armor textures that work with CIT and vanilla Minecraft</p>
                    <UploadMultiple />
                </div>
            </main>
        </>
    )
}

export default Velvet
