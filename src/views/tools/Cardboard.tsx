import React from 'react'
import Breadcrumb from '../../components/Breadcrumb';
import UploadMultiple from '../../components/UploadMultiple';

const Cardboard = () => {
    return (<>
        <Breadcrumb path={[{ name: "Home", link: "/" }, { name: "Tools", link: "/tools" }, { name: "Cardboard", link: "/tools/cardboard" }]} />
        <main className='cardboard'>
            <form onSubmit={e => {e.preventDefault(); console.log(e);}}>
                <UploadMultiple />
                <input type='submit' value='Submit' />
            </form>
        </main>
    </>)
}

export default Cardboard
