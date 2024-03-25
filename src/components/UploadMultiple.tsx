import React from 'react'
import './UploadMultiple.scss'

const UploadMultiple = () => {
    const [files, setFiles] = React.useState<File[]>([]);

    const addFiles = (files: FileList) => {
        setFiles(prev => [...prev, ...Array.from(files)]);
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.target.files && addFiles(e.target.files);
    }

    const onDrop = (e: React.DragEvent<HTMLInputElement>) => {
        e.preventDefault();
        addFiles(e.dataTransfer.files);
    }

    return (
        <div className='uploadMultiple'>
            <input
                type='file'
                className='upload'
                multiple
                onChange={onChange}
                onDrop={onDrop}
            />
            <div className='files'>
                {files.map(file => (
                    <div key={file.name} className='file'>
                        <span>{file.name}</span>
                        <button onClick={() => setFiles(prev => prev.filter(f => f !== file))}>Remove</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UploadMultiple