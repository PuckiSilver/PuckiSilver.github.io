import React from 'react'
import './UploadMultiple.scss'

const UploadMultiple = () => {
    const [file, setFile] = React.useState<File|undefined>(undefined);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.target.files && setFile(e.target.files[0]);
    }

    const onDrop = (e: React.DragEvent<HTMLInputElement>) => {
        e.preventDefault();
        setFile(e.dataTransfer.files[0]);
    }

    return (
        <div className='upload_multiple'>
            <input
                type='file'
                className='upload'
                onChange={onChange}
                onDrop={onDrop}
            />
            <div className='file_name'>
                {file ? <>
                    <span>{file.name}</span>
                    <button onClick={() => setFile(undefined)}>X</button>
                </> : <span>No file chosen...</span>}
            </div>
        </div>
    )
}

export default UploadMultiple