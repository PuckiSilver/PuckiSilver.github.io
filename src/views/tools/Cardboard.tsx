import React from 'react'
import UploadMultiple from '../../components/UploadMultiple';
import './Cardboard.scss';

const Cardboard = () => {
    return (<>
        <main className='cardboard'>
            <div className='cardboard_header'>
                <h1>Cardboard</h1>
                <span>v2.0.0</span>
            </div>
            <div className='section'>
                <form onSubmit={e => {e.preventDefault(); console.log(e);}}>
                    <div className='cardboard_row'>
                        <label>
                            <h3>Resource Pack:</h3>
                            <UploadMultiple />
                        </label>
                        <label>
                            <h3>Data Pack:</h3>
                            <UploadMultiple />
                        </label>
                    </div>
                    <input type='submit' value='Submit' />
                </form>
            </div>
        </main>
    </>)
}

export default Cardboard
