import { useCallback, useEffect, useRef, useState } from 'react';
import './Survive.scss';
import ArrowsFullscreenIcon from '../../icons/arrows-fullscreen';
import PauseIcon from '../../icons/pause';
import PlayIcon from '../../icons/play';
import { GameState, Entity } from './survive/SurviveTypes';
import { damageEntity, getBaseStats, getStatTotal } from './survive/Utils';

const Survive = () => {
    const gameWindow = useRef<HTMLDivElement>(null);
    const joystick = useRef<HTMLDivElement>(null);
    const isUsingJoystick = useRef(false);
    const joystickTouchIndex = useRef(0);
    const initialPinchDistance = useRef(0);
    const isFullscreen = useRef(false);
    const fps = useRef(60);
    const isPaused = useRef(false);
    const scale = useRef(12);
    const isKeyPressed = useRef<{[key: string]: boolean}>({});
    const playerMoveDirection = useRef({x: 0, y: 0});
    const lastTimestamp = useRef<number>(performance.now());
    const [, forceUpdate] = useState({});

    const player = useRef<Entity>(new Entity(
        {x: 0, y: 0, r: 2.4},
        getBaseStats({
            health: 100,
            speed: .02,
            autoDamage: 2,
            iFrames: 20,
        }),
        (player, _, delta) => {
            if (!isUsingJoystick.current) {
                playerMoveDirection.current = {x: 0, y: 0};
                if (isKeyPressed.current['w']) playerMoveDirection.current.y++;
                if (isKeyPressed.current['s']) playerMoveDirection.current.y--;
                if (isKeyPressed.current['a']) playerMoveDirection.current.x++;
                if (isKeyPressed.current['d']) playerMoveDirection.current.x--;
            }
            // normalize vector
            const currentPlayerSpeed = Math.sqrt(playerMoveDirection.current.x ** 2 + playerMoveDirection.current.y ** 2);
            if (currentPlayerSpeed === 0) {
                return;
            }
            player.position = {
                x: player.position.x - (playerMoveDirection.current.x / currentPlayerSpeed) * delta * getStatTotal(player.stats.speed),
                y: player.position.y - (playerMoveDirection.current.y / currentPlayerSpeed) * delta * getStatTotal(player.stats.speed),
                r: player.position.r
            };
            document.documentElement.style.setProperty('--player-x', `${player.position.x}px`);
            document.documentElement.style.setProperty('--player-y', `${player.position.y}px`);
    }));
    const [gameState, setGameState] = useState<GameState>({
        player: player,
        enemies: [
            new Entity(
                {x: -18, y: -18, r: 1.6},
                getBaseStats({
                    health: 100,
                    speed: .01,
                    autoDamage: 2,
                }),
                (entity, gameState, delta) => {
                    const entityVector = {x: entity.position.x - gameState.player.current.position.x, y: entity.position.y - gameState.player.current.position.y};
                    const entitySpeed = Math.sqrt(entityVector.x ** 2 + entityVector.y ** 2);
                    if (Math.abs(entitySpeed) < (entity.position.r + gameState.player.current.position.r)) {
                        damageEntity(gameState.player.current, getStatTotal(entity.stats.autoDamage));
                        setGameState({...gameState});
                        return;
                    };
                    entity.position = {
                        x: entity.position.x - (entityVector.x / entitySpeed) * delta * getStatTotal(entity.stats.speed),
                        y: entity.position.y - (entityVector.y / entitySpeed) * delta * getStatTotal(entity.stats.speed),
                        r: entity.position.r,
                    };
                    setGameState({...gameState});
                }
            ),
        ],
        bullets: [],
    });
    const gameStateRef = useRef(gameState);


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
    const gameLoop = useCallback(() => {
        const timestamp = performance.now();
        const delta = Math.abs(lastTimestamp.current - timestamp);
        lastTimestamp.current = timestamp;

        if (gameStateRef.current.player.current.iFramesLeft > 0) gameStateRef.current.player.current.iFramesLeft -= delta * fps.current / 1000;
        if (gameStateRef.current.player.current.iFramesLeft < 0) gameStateRef.current.player.current.iFramesLeft = 0;

        if (!isPaused.current) {
            gameStateRef.current.player.current.onTick(gameStateRef.current.player.current, gameStateRef.current, delta);
            gameStateRef.current.enemies.forEach(enemy => enemy.onTick(enemy, gameStateRef.current, delta));
            gameStateRef.current.bullets.forEach(bullet => bullet.onTick(bullet, gameStateRef.current, delta));
        }

        setTimeout(gameLoop, 1000 / fps.current);
    }, []);

    useEffect(() => {
        document.documentElement.style.setProperty('--player-x', '0px');
        document.documentElement.style.setProperty('--player-y', '0px');
        document.documentElement.style.setProperty('--scale', `${scale.current}`);
    }, [])

    useEffect(() => { // set up game stuff
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
                forceUpdate({});
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
                    forceUpdate({});
                    initialPinchDistance.current = currentPinchDistance;
                }
            }}
        >
            <div className='buttons'>
                <button onClick={() => {
                    isFullscreen.current = !isFullscreen.current;
                    setTimeout(() => setGameState(gs => ({...gs})), 1); // timeout of 1 to wait for fullscreen to take effect
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
            {gameState.enemies.map((enemy, i) => {
                const screenSize = gameWindow.current?.getBoundingClientRect();
                if (!screenSize) return null;
                return (<div
                    key={`enemy_${i}`}
                    className='enemy'
                    style={{left: enemy.position.x * scale.current + screenSize.width / 2, top: enemy.position.y * scale.current + screenSize.height / 2}}
                />)
            })}
            <div className={`player${gameState.player.current.iFramesLeft ? ' damaged' : ''}`} />
            <div className='health_bar'>
                <span>Health: {gameState.player.current.health}</span>
                <div className='health_background' style={{width: getStatTotal(gameState.player.current.stats.health)}}>
                    <div className='health' style={{width: `${100 * gameState.player.current.health / getStatTotal(gameState.player.current.stats.health)}%`}} />
                </div>
            </div>
            <div className='joystick' ref={joystick}
                onTouchMove={e => {
                    const currentJoystick = joystick.current;
                    if (!currentJoystick) return;
                    const joystickTouch = Array.from(e.touches).find(touch => touch.identifier === joystickTouchIndex.current);
                    if (!joystickTouch) return;
                    playerMoveDirection.current = {
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
                    playerMoveDirection.current = {
                        x: -(joystickTouch.clientX - currentJoystick.getBoundingClientRect().left - currentJoystick.clientWidth / 2),
                        y: -(joystickTouch.clientY - currentJoystick.getBoundingClientRect().top - currentJoystick.clientHeight / 2),
                    };
                }}
                onTouchEnd={() => {
                    playerMoveDirection.current = {x: 0, y: 0};
                    isUsingJoystick.current = false;
                }}
            />
        </div>
    </main>);
}

export default Survive;
