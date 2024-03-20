import React from 'react'
import Breadcrumb from '../../components/Breadcrumb';

const Cardboard = () => {
    return (<>
        <Breadcrumb path={[{ name: "Home", link: "/" }, { name: "Tools", link: "/tools" }, { name: "Cardboard", link: "/tools/cardboard" }]} />
        <main className='cardboard'>
            <form onSubmit={e => {e.preventDefault(); console.log(e);}}>
                <div className='files'>
                    <input type='file' id='dpfileid' name='dpfile' className='dpfile' />
                    <input type='file' id='rpfileid' name='rpfile' className='rpfile' />
                </div>
                <div className='inputs'>
                    
                </div>
                <input type='submit' value='Submit' />
            </form>
        </main>
    </>)
}

export default Cardboard
