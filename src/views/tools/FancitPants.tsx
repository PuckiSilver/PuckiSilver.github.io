import React from 'react'
import Breadcrumb from '../../components/Breadcrumb'

const FancitPants = () => {
    return (
        <>
            <Breadcrumb path={[{ name: "Home", link: "/" }, { name: "Tools", link: "/tools" }, { name: "FanCIT Pants", link: "/tools/fancit-pants" }]} />
            <div>FancitPants</div>
        </>
    )
}

export default FancitPants
