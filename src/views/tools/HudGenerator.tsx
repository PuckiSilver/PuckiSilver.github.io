import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import PlusRectangleIcon from '../../icons/plus-rectangle';
import TrashIcon from '../../icons/trash';
import './HudGenerator.scss';

function HudGenerator() {
    const [images, setImages] = useState<Array<{src: string, filename: string}>>([]);
    const canvasRef = useRef<HTMLDivElement>(null);
    const [pixelSize, setPixelSize] = useState({x:1920,y:1080});
    const [guiScale, setGuiScale] = useState(2);


    const handleAddNewAsset = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e?.currentTarget?.files;
        if (!files || files.length === 0) {
            return;
        }

        const file = files[0];
        if (!file.type.match('image/png')) {
            return;
        }

        const reader = new FileReader();

        reader.onload = ev => {
            const base64String = ev.target?.result as string;
            setImages(prev => [...prev, {
                src: base64String,
                filename: file.name,
            }]);
        }

        reader.readAsDataURL(file);

        e.currentTarget.value = '';
    }


    /*useEffect(() => {
        const unloadCallback = (event: any) => {
            event.preventDefault();
            event.returnValue = "";
            return "";
        };

        window.addEventListener("beforeunload", unloadCallback);
        return () => window.removeEventListener("beforeunload", unloadCallback);
    }, []);*/


    return (<main className='hud_generator'>
        <h1>Hud Generator</h1>
        <div className='section'>
            <h2>How to use</h2>
            <p>
                You need a <b>mouse</b> to use the editor.
                You can add <b>.png</b> assets using the <b>[+]</b> on the right of the image.
            </p>
        </div>
        <div className='editor'>
            <div className='canvas' ref={canvasRef}>
                <img alt='background' src='https://raw.githubusercontent.com/ps-dps/MobArmory/refs/heads/main/images/trimmed.png' draggable={false}/>
            </div>
            <div className='assets'>
                {images.map((i, idx) => (
                    <div className='asset_line' key={i.filename}>
                        <div className='image_container'>
                            <img src={i.src} alt={i.filename} draggable={false}/>
                        </div>
                        <span>{i.filename}</span>
                        <div className='action_elements'>
                            <button onClick={_ => setImages(prev => [...prev.slice(0,idx), ...prev.slice(idx+1)])}>
                                <TrashIcon/>
                            </button>
                        </div>
                    </div>
                ))}
                <label className='add_line' key="add_line" htmlFor='new_image'>
                    <input type='file' id='new_image' onChange={handleAddNewAsset} />
                    <PlusRectangleIcon/>
                </label>
            </div>
        </div>
    </main>);
}

export default HudGenerator;
