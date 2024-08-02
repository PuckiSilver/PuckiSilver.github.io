import React from 'react'
import UploadMultiple from '../../components/UploadMultiple';

const Cardboard = () => {
    return (<>
        <main className='cardboard'>
            <form onSubmit={e => {e.preventDefault(); console.log(e);}}>
                <UploadMultiple />
                <input type='submit' value='Submit' />
            </form>
        </main>
    </>)
}

export default Cardboard
