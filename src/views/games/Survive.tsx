import { useEffect, useRef, useState } from 'react';
import './Survive.scss';

const Survive = () => {
    const gameWindow = useRef<HTMLDivElement>(null);
    const isKeyPressed = useRef<{[key: string]: boolean}>({});
    const lastTimestamp = useRef<number>(performance.now());
    const [cameraPosition, setCameraPosition] = useState({x: 0, y: 0});
    const [playerSpeed, setPlayerSpeed] = useState(.01);
    const [scale, setScale] = useState(12);

    /*useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            document.documentElement.style.setProperty('--camera-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--camera-y', `${e.clientY}px`);
        }

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);*/

    // gameWindow.current?.getBoundingClientRect();





    /*  Handle Key Presses  */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            isKeyPressed.current[e.key] = true;
        }
        const handleKeyUp = (e: KeyboardEvent) => {
            isKeyPressed.current[e.key] = false;
        }
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        document.documentElement.style.setProperty('--scale', `${scale}`);
    }, [scale])

    /*  Render frame and handle movement up to 60 times a second  */
    useEffect(() => {
        document.documentElement.style.setProperty('--camera-x', `${cameraPosition.x}px`);
        document.documentElement.style.setProperty('--camera-y', `${cameraPosition.y}px`);
    }, [cameraPosition]);

    const gameLoop = (timestamp: number) => {
        const delta = lastTimestamp.current - timestamp;
        lastTimestamp.current = timestamp;
        const playerVector = {x: 0, y: 0};
        if (isKeyPressed.current['w']) playerVector.y--;
        if (isKeyPressed.current['s']) playerVector.y++;
        if (isKeyPressed.current['a']) playerVector.x--;
        if (isKeyPressed.current['d']) playerVector.x++;
        // normalize vector
        const currentPlayerSpeed = Math.sqrt(playerVector.x ** 2 + playerVector.y ** 2);
        if (currentPlayerSpeed === 0) {
            requestAnimationFrame(gameLoop);
            return;
        }
        setCameraPosition(prev => ({
            x: prev.x + (playerVector.x / currentPlayerSpeed) * delta * playerSpeed * scale,
            y: prev.y + (playerVector.y / currentPlayerSpeed) * delta * playerSpeed * scale,
        }));

        requestAnimationFrame(gameLoop);
    }
    useEffect(() => { // set up game stuff
        document.documentElement.style.setProperty('--scale', '10');
        requestAnimationFrame(gameLoop);
    }, []);

    /*  Handle Scroll  */
    useEffect(() => {
        const handleScroll = (event: WheelEvent) => {
            if (!gameWindow.current || event.deltaY === 0) return;
            setScale(prev => {
                const newScale = prev + (event.deltaY > 0 ? -.4 : .4);
                if (newScale < 4) return 4;
                if (newScale > 17) return 17;
                return newScale;
            });
        }
        gameWindow.current?.addEventListener('wheel', handleScroll);
        return () => gameWindow.current?.removeEventListener('wheel', handleScroll);
    }, []);

    return (<main>
        <h1>Survive!</h1>
        <div
            className='game_window'
            ref={gameWindow}
            onScroll={() => console.log('somntijhdgn hasppend')}
        >
            <img src={require('../../assets/survive/background.png')} alt='background' className='background' />
            <div className='player'/>
        </div>
    </main>);
}

export default Survive;
