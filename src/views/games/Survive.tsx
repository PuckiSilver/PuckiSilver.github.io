import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './Survive.scss';
import ArrowsFullscreenIcon from '../../icons/arrows-fullscreen';
import PauseIcon from '../../icons/pause';
import PlayIcon from '../../icons/play';
import ChevronLeftIcon from '../../icons/chevron-left';
import { GameState, Entity, Bullet, XPOrb, Player } from './survive/SurviveTypes';
import { damageEntity, getBaseStats, getStatTotal } from './survive/Utils';

const Survive = () => {
    const gameWindow = useRef<HTMLDivElement>(null);
    const joystick = useRef<HTMLDivElement>(null);
    const isUsingJoystick = useRef(false);
    const joystickTouchIndex = useRef(0);
    const initialPinchDistance = useRef(0);
    const isFullscreen = useRef(false);
    const fps = useRef(60);
    const isPaused = useRef(true);
    const scale = useRef(12);
    const isKeyPressed = useRef<{[key: string]: boolean}>({});
    const playerMoveDirection = useRef({x: 0, y: 0});
    const mousePosition = useRef({x: 0, y: 0});
    const lastTimestamp = useRef<number>(performance.now());
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [isJoystickLeft, setIsJoystickLeft] = useState(false);
    const [, forceUpdate] = useState({});
    const preventDefaultKeys = useMemo(() => ['w', 'a', 's', 'd', ' '], []);
    const spawnEnemyCooldown = useRef(0);

    const player = useRef<Player>(new Player(
        {x: 0, y: 0, r: 2.4},
        getBaseStats({
            health: 100,
            speed: .02,
            autoDamage: 2,
            autoSpeed: 1,
            iFrames: 20,
        }),
        (entity, gameState, delta) => {
            const player = entity as Player;
            // console.log(player.autoCooldownTicks);
            if (player.autoCooldownTicks > 0) player.autoCooldownTicks -= delta * fps.current / 1000;
            if (player.autoCooldownTicks <= 0) {
                const mouseVectorLength = Math.sqrt(mousePosition.current.x ** 2 + mousePosition.current.y ** 2);
                if (mouseVectorLength !== 0) {
                    gameState.bullets.push(new Bullet(
                        {x: player.position.x, y: player.position.y, r: .2},
                        {
                            x: (mousePosition.current.x / mouseVectorLength) * 0.05,
                            y: (mousePosition.current.y / mouseVectorLength) * 0.05,
                        },
                        10,
                        100,
                        (bullet, gameState, delta) => {
                            bullet.position = {
                                x: bullet.position.x + bullet.motion.x * delta,
                                y: bullet.position.y + bullet.motion.y * delta,
                                r: bullet.position.r,
                            };
                            // implement friction if one generalizes this to more than one bullet
                            gameState.enemies.forEach(enemy => {
                                if (Math.sqrt((bullet.position.x - enemy.position.x) ** 2 + (bullet.position.y - enemy.position.y) ** 2) < bullet.position.r + enemy.position.r) {
                                    damageEntity(enemy, bullet.damage, gameState);
                                }
                            });
                            bullet.ticksAlive -= delta * fps.current / 1000;
                            if (bullet.ticksAlive <= 0) {
                                gameState.bullets.splice(gameState.bullets.indexOf(bullet), 1);
                            }
                        },
                    ));
                    player.autoCooldownTicks = fps.current / getStatTotal(player.stats.autoSpeed);
                }
            }


            if (!isUsingJoystick.current) {
                playerMoveDirection.current = {x: 0, y: 0};
                if (isKeyPressed.current['w']) playerMoveDirection.current.y++;
                if (isKeyPressed.current['s']) playerMoveDirection.current.y--;
                if (isKeyPressed.current['a']) playerMoveDirection.current.x++;
                if (isKeyPressed.current['d']) playerMoveDirection.current.x--;
            }
            // normalize vector
            const currentPlayerSpeed = Math.sqrt(playerMoveDirection.current.x ** 2 + playerMoveDirection.current.y ** 2);
            if (currentPlayerSpeed !== 0) {
                player.position = {
                    x: player.position.x - (playerMoveDirection.current.x / currentPlayerSpeed) * delta * getStatTotal(player.stats.speed),
                    y: player.position.y - (playerMoveDirection.current.y / currentPlayerSpeed) * delta * getStatTotal(player.stats.speed),
                    r: player.position.r
                };
                document.documentElement.style.setProperty('--player-x', `${player.position.x}px`);
                document.documentElement.style.setProperty('--player-y', `${player.position.y}px`);
            }

            if (spawnEnemyCooldown.current > 0) spawnEnemyCooldown.current -= delta * fps.current / 1000;
            if (spawnEnemyCooldown.current <= 0) {
                spawnEnemyCooldown.current = 120;
                const randomAngle = Math.PI * (Math.random() + (Math.random() > .5 ? -1 : 1));
                gameState.enemies.push(new Entity(
                    {
                        x: player.position.x + 50 * Math.cos(randomAngle),
                        y: player.position.y + 50 * Math.sin(randomAngle),
                        r: 1.6,
                    },
                    getBaseStats({
                        health: 20,
                        speed: .01,
                        autoDamage: 2,
                        iFrames: 20,
                    }),
                    (entity, gameState, delta) => {
                        const entityVector = {x: entity.position.x - gameState.player.current.position.x, y: entity.position.y - gameState.player.current.position.y};
                        const entitySpeed = Math.sqrt(entityVector.x ** 2 + entityVector.y ** 2);
                        if (Math.abs(entitySpeed) < (entity.position.r + gameState.player.current.position.r)) {
                            damageEntity(gameState.player.current, getStatTotal(entity.stats.autoDamage), gameState);
                            return;
                        };
                        entity.position = {
                            x: entity.position.x - (entityVector.x / entitySpeed) * delta * getStatTotal(entity.stats.speed),
                            y: entity.position.y - (entityVector.y / entitySpeed) * delta * getStatTotal(entity.stats.speed),
                            r: entity.position.r,
                        };
                    },
                    (entity, gameState) => {
                        gameState.xpOrbs.push(new XPOrb(
                            {
                                x: entity.position.x,
                                y: entity.position.y,
                                r: .4,
                            },
                            10,
                        ));
                        gameState.enemies.splice(gameState.enemies.indexOf(entity), 1);
                    },
                ));
            }

            gameState.xpOrbs.forEach((orb) => {
                const distanceToPlayer = Math.sqrt((player.position.x - orb.position.x) ** 2 + (player.position.y - orb.position.y) ** 2);
                if (distanceToPlayer < player.position.r + orb.position.r) {
                    player.xp += orb.xp;
                    gameState.xpOrbs.splice(gameState.xpOrbs.indexOf(orb), 1);
                }
            });
            while (player.xp >= player.xpToNextLevel) {
                player.xp -= player.xpToNextLevel;
                player.level++;
                player.xpToNextLevel *= 2;
            }
        },
        () => {},
    ));
    const [gameState, setGameState] = useState<GameState>({
        player: player,
        enemies: [],
        bullets: [],
        xpOrbs: [],
    });
    const gameStateRef = useRef(gameState);


    /*  Handle Key Presses  */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (preventDefaultKeys.includes(e.key)) e.preventDefault();
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
    }, [preventDefaultKeys]);

    /*  Handle Mouse Movement  */
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // get mouse position centered on gameWindow center
            mousePosition.current = {
                x: (e.clientX - gameWindow.current!.getBoundingClientRect().left - gameWindow.current!.clientWidth / 2) / scale.current,
                y: (e.clientY - gameWindow.current!.getBoundingClientRect().top - gameWindow.current!.clientHeight / 2) / scale.current,
            };
        }
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    /*  Detect Touch Device  */
    useEffect(() => {
        const handleTouchStart = () => {
            setIsTouchDevice(true);
        }
        window.addEventListener('touchstart', handleTouchStart);
        return () => window.removeEventListener('touchstart', handleTouchStart);
    }, []);

    /*  Handle Movement and Render Frame  */
    const gameLoop = useCallback(() => {
        const timestamp = performance.now();
        const delta = Math.abs(lastTimestamp.current - timestamp);
        lastTimestamp.current = timestamp;

        if (!isPaused.current) {
            if (gameStateRef.current.player.current.iFramesLeft > 0) gameStateRef.current.player.current.iFramesLeft -= delta * fps.current / 1000;
            if (gameStateRef.current.player.current.iFramesLeft < 0) gameStateRef.current.player.current.iFramesLeft = 0;
            gameStateRef.current.enemies.forEach(enemy => {
                if (enemy.iFramesLeft > 0) enemy.iFramesLeft -= delta * fps.current / 1000;
                if (enemy.iFramesLeft < 0) enemy.iFramesLeft = 0;
            });

            gameStateRef.current.player.current.onTick(gameStateRef.current.player.current, gameStateRef.current, delta);
            gameStateRef.current.enemies.forEach(enemy => enemy.onTick(enemy, gameStateRef.current, delta));
            gameStateRef.current.bullets.forEach(bullet => bullet.onTick(bullet, gameStateRef.current, delta));
        }
        setGameState({...gameStateRef.current});

        setTimeout(gameLoop, 1000 / fps.current);
    }, []);

    useEffect(() => {
        document.documentElement.style.setProperty('--player-x', '0px');
        document.documentElement.style.setProperty('--player-y', '0px');
        document.documentElement.style.setProperty('--scale', `${scale.current}`);
    }, [])

    useEffect(() => { // start game loop
        lastTimestamp.current = performance.now();
        setTimeout(gameLoop, 1000 / fps.current);
    }, [gameLoop]);

    /*  Handle Zoom  */
    useEffect(() => {
        const handleScroll = (event: WheelEvent) => {
            if (!gameWindow.current || event.deltaY === 0) return;
            event.preventDefault();
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

    const screenSize = gameWindow.current?.getBoundingClientRect();

    return (<main className='survive'>
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
                if (e.touches.length === 1 || (e.touches.length === 2 && isUsingJoystick.current)) {
                    const currentTouch = isUsingJoystick ? Array.from(e.touches).find(touch => touch.identifier !== joystickTouchIndex.current) : e.touches[0];
                    if (!currentTouch) return;
                    mousePosition.current = {
                        x: (currentTouch.clientX - gameWindow.current!.getBoundingClientRect().left - gameWindow.current!.clientWidth / 2) / scale.current,
                        y: (currentTouch.clientY - gameWindow.current!.getBoundingClientRect().top - gameWindow.current!.clientHeight / 2) / scale.current,
                    };
                } else if (e.touches.length === 2 && !isUsingJoystick.current) {
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
            {screenSize && gameState.xpOrbs.map((orb, i) => {
                return (<div
                    key={`xp_${i}`}
                    className='xp'
                    style={{left: orb.position.x * scale.current + screenSize.width / 2, top: orb.position.y * scale.current + screenSize.height / 2}}
                />)
            })}
            {screenSize && gameState.enemies.map((enemy, i) => {
                return (<div
                    key={`enemy_${i}`}
                    className={`enemy${enemy.iFramesLeft ? ' damaged' : ''}`}
                    style={{left: enemy.position.x * scale.current + screenSize.width / 2, top: enemy.position.y * scale.current + screenSize.height / 2}}
                />)
            })}
            {screenSize && gameState.bullets.map((bullet, i) => {
                return (<div
                    key={`bullet_${i}`}
                    className='bullet'
                    style={{left: bullet.position.x * scale.current + screenSize.width / 2, top: bullet.position.y * scale.current + screenSize.height / 2}}
                />)
            })}
            {screenSize && <div className='cursor' style={{
                left: (mousePosition.current.x + gameState.player.current.position.x) * scale.current + screenSize.width / 2,
                top: (mousePosition.current.y + gameState.player.current.position.y) * scale.current + screenSize.height / 2,
            }} />}
            <div className={`player${gameState.player.current.iFramesLeft ? ' damaged' : ''}`}>
                <div className='shadow' />
            </div>
            <div className='bars'>
                <span>Health: {gameState.player.current.health} | Level: {gameState.player.current.level}</span>
                <div className='health_background' style={{width: getStatTotal(gameState.player.current.stats.health)}}>
                    <div className='health_bar' style={{width: `${100 * gameState.player.current.health / getStatTotal(gameState.player.current.stats.health)}%`}} />
                </div>
                <div className='xp_background' style={{width: gameState.player.current.xpToNextLevel}}>
                    <div className='xp_bar' style={{width: `${100 * gameState.player.current.xp / gameState.player.current.xpToNextLevel}%`}} />
                </div>
            </div>
            {isTouchDevice && <div className={`joystick${isJoystickLeft ? ' joystick_left' : ''}`} ref={joystick}
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
            >
                <ChevronLeftIcon className='joystick_button' onTouchStart={() => setIsJoystickLeft(l => !l)} />
            </div>}
        </div>
    </main>);
}

export default Survive;
