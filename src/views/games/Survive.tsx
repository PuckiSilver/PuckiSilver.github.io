import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './Survive.scss';
import ArrowsFullscreenIcon from '../../icons/arrows-fullscreen';
import PauseIcon from '../../icons/pause';
import PlayIcon from '../../icons/play';

type Entity = {
    x: number;
    y: number;
    speed: number;
    damageRadius: number;
    damage: number;
}

const Survive = () => {
    const gameWindow = useRef<HTMLDivElement>(null);
    const joystick = useRef<HTMLDivElement>(null);
    const isUsingJoystick = useRef(false);
    const joystickTouchIndex = useRef(0);
    const isKeyPressed = useRef<{[key: string]: boolean}>({});
    const lastTimestamp = useRef<number>(performance.now());
    const [cameraPosition, setCameraPosition] = useState({x: 0, y: 0});
    const cameraPosRef = useRef(cameraPosition);
    const playerSpeed = useRef(.015);
    const isFullscreen = useRef(false);
    const playerHealthMax = useRef(100);
    const playerHealth = useRef(playerHealthMax.current);
    const playerIFrames = useRef(500);
    const playerInvincible = useRef(false);
    const fps = useRef(60);
    const isPaused = useRef(false);
    const scale = useRef(12);
    const [entities, setEntities] = useState<Entity[]>([{x: -18, y: -18, speed: .01, damageRadius: 1.7, damage: 2}]);
    const playerRadius = 1.5;
    const [, forceUpdate] = useState({});
    const playerVector = useRef({x: 0, y: 0});
    const initialPinchDistance = useRef(0);

    const damagePlayer = (damage: number) => {
        if (playerInvincible.current) return;
        playerHealth.current -= damage;
        playerInvincible.current = true;
        setTimeout(() => playerInvincible.current = false, playerIFrames.current);
    };


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


    /*  Handle Movement and Render Frame  */
    useEffect(() => {
        cameraPosRef.current = cameraPosition;
        document.documentElement.style.setProperty('--camera-x', `${cameraPosition.x}px`);
        document.documentElement.style.setProperty('--camera-y', `${cameraPosition.y}px`);
    }, [cameraPosition]);

    const gameLoop = useCallback(() => {
        const timestamp = performance.now();
        const delta = lastTimestamp.current - timestamp;
        lastTimestamp.current = timestamp;

        if (!isPaused.current) {
            if (!isUsingJoystick.current) {
                playerVector.current = {x: 0, y: 0};
                if (isKeyPressed.current['w']) playerVector.current.y++;
                if (isKeyPressed.current['s']) playerVector.current.y--;
                if (isKeyPressed.current['a']) playerVector.current.x++;
                if (isKeyPressed.current['d']) playerVector.current.x--;
            }
            // normalize vector
            const currentPlayerSpeed = Math.sqrt(playerVector.current.x ** 2 + playerVector.current.y ** 2);
            if (currentPlayerSpeed !== 0) {
                setCameraPosition(prev => ({
                    x: prev.x + (playerVector.current.x / currentPlayerSpeed) * delta * playerSpeed.current,
                    y: prev.y + (playerVector.current.y / currentPlayerSpeed) * delta * playerSpeed.current,
                }));
            }

            // advance entities towards player/camera
            setEntities(prev => prev.map(entity => {
                const entityVector = {x: entity.x - cameraPosRef.current.x, y: entity.y - cameraPosRef.current.y};
                const entitySpeed = Math.sqrt(entityVector.x ** 2 + entityVector.y ** 2);
                if (Math.abs(entitySpeed) < (entity.damageRadius + playerRadius)) {
                    damagePlayer(entity.damage);
                    return entity;
                };
                return {
                    ...entity,
                    x: entity.x + (entityVector.x / entitySpeed) * delta * entity.speed,
                    y: entity.y + (entityVector.y / entitySpeed) * delta * entity.speed,
                };
            }));
        } else {
            ;
        }

        setTimeout(gameLoop, 1000 / fps.current);
    }, []);

    useEffect(() => { // set up game stuff
        document.documentElement.style.setProperty('--scale', `${scale.current}`);
        lastTimestamp.current = performance.now();
        setTimeout(gameLoop, 1000 / fps.current);
    }, [gameLoop]);


    /*  Handle Zoom  */
    useEffect(() => {
        const handleScroll = (event: WheelEvent) => {
            if (!gameWindow.current || event.deltaY === 0) return;
                scale.current += (event.deltaY > 0 ? -.4 : .4);
                if (scale.current < 4) scale.current = 4;
                if (scale.current > 17) scale.current = 17;
                document.documentElement.style.setProperty('--scale', `${scale.current}`);
                setEntities(prev => prev.map(entity => entity));
        }
        const currentGameWindow = gameWindow.current;
        if (!currentGameWindow) return;
        currentGameWindow.addEventListener('wheel', handleScroll);
        return () => currentGameWindow.removeEventListener('wheel', handleScroll);
    }, []);

    return (<main>
        <h1>Survive!</h1>
        <div
            className={`game_window${isFullscreen.current ? ' fullscreen' : ''}${isPaused.current ? ' paused' : ''}`}
            ref={gameWindow}
            onTouchStart={e => {
                if (e.touches.length === 2 && !isUsingJoystick.current) {
                    initialPinchDistance.current = Math.sqrt(
                        (e.touches[0].clientX - e.touches[1].clientX) ** 2 +
                        (e.touches[0].clientY - e.touches[1].clientY) ** 2
                    );
                }
            }}
            onTouchMove={e => {
                if (e.touches.length === 2 && !isUsingJoystick.current) {
                    const currentPinchDistance = Math.sqrt(
                        (e.touches[0].clientX - e.touches[1].clientX) ** 2 +
                        (e.touches[0].clientY - e.touches[1].clientY) ** 2
                    );
                    const deltaPinchDistance = currentPinchDistance - initialPinchDistance.current;
                    scale.current += deltaPinchDistance / 50;
                    if (scale.current < 4) scale.current = 4;
                    if (scale.current > 17) scale.current = 17;
                    document.documentElement.style.setProperty('--scale', `${scale.current}`);
                    setEntities(prev => prev.map(entity => entity));
                    initialPinchDistance.current = currentPinchDistance;
                }
            }}
        >
            <div className='buttons'>
                <button onClick={() => {
                    isFullscreen.current = !isFullscreen.current;
                    setTimeout(() => setEntities(prev => prev.map(entity => entity)), 1); // timeout of 1 to wait for fullscreen to take effect
                    forceUpdate({});
                }}>
                    <ArrowsFullscreenIcon />
                </button>
                <button onClick={() => {
                    isPaused.current = !isPaused.current;
                    forceUpdate({});
                }}>
                    {isPaused.current ? <PlayIcon /> : <PauseIcon />}
                </button>
            </div>
            <img src={require('../../assets/survive/background.png')} alt='background' className='background' />
            {entities.map((entity, i) => {
                const screenSize = gameWindow.current?.getBoundingClientRect();
                if (!screenSize) return null;
                return (<div
                    key={`entity_${i}`}
                    className='entity'
                    style={{left: entity.x * scale.current + screenSize.width / 2, top: entity.y * scale.current + screenSize.height / 2}}
                />)
            })}
            <div className={`player${playerInvincible.current ? ' invincible' : ''}`} />
            <div className='health_bar'>
                <span>Health: {playerHealth.current}</span>
                <div className='health_background' style={{width: playerHealthMax.current}}>
                    <div className='health' style={{width: `${100 * playerHealth.current / playerHealthMax.current}%`}} />
                </div>
            </div>
            <div className='joystick' ref={joystick}
                onTouchMove={e => {
                    const currentJoystick = joystick.current;
                    if (!currentJoystick) return;
                    const joystickTouch = Array.from(e.touches).find(touch => touch.identifier === joystickTouchIndex.current);
                    if (!joystickTouch) return;
                    playerVector.current = {
                        x: -(joystickTouch.clientX - currentJoystick.getBoundingClientRect().left - currentJoystick.clientWidth / 2),
                        y: -(joystickTouch.clientY - currentJoystick.getBoundingClientRect().top - currentJoystick.clientHeight / 2),
                    };
                }}
                onTouchStart={e => {
                    const currentJoystick = joystick.current;
                    if (!currentJoystick) return;
                    const joystickTouch = e.touches[e.touches.length - 1];
                    joystickTouchIndex.current = joystickTouch.identifier;
                    isUsingJoystick.current = true;
                    playerVector.current = {
                        x: -(joystickTouch.clientX - currentJoystick.getBoundingClientRect().left - currentJoystick.clientWidth / 2),
                        y: -(joystickTouch.clientY - currentJoystick.getBoundingClientRect().top - currentJoystick.clientHeight / 2),
                    };
                }}
                onTouchEnd={() => {
                    playerVector.current = {x: 0, y: 0};
                    isUsingJoystick.current = false;
                }}
            />
        </div>
    </main>);
}

export default Survive;
