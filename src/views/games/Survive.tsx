import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './Survive.scss';
import ArrowsFullscreenIcon from '../../icons/arrows-fullscreen';
import PauseIcon from '../../icons/pause';
import PlayIcon from '../../icons/play';
import ArrowRightIcon from '../../icons/arrow-right';
import ChevronLeftIcon from '../../icons/chevron-left';
import CloseIcon from '../../icons/close';
import { GameState, Entity, Player, Upgrade, Tickable, Stats, Item, StatNames } from './survive/SurviveTypes';
import { getBaseStats, getRandomUpgrade, getStatFormatted, getStatTotal, implementsTickable, roundWithPrecision, statToIcon, statToStatName } from './survive/Utils';

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
    const totalTimeElapsed = useRef(0);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [isJoystickLeft, setIsJoystickLeft] = useState(false);
    const [checkedUpgrade, setCheckedUpgrade] = useState<number | null>(null);
    const [availableUpgrades, setAvailableUpgrades] = useState<Upgrade[]>([]);
    const [availableItems, setAvailableItems] = useState<Item[]>([
        new Item(
            'destiny_dice',
            'Dice of Destiny',
            'Permanently double a random stat, but halve another',
            'https://raw.githubusercontent.com/ps-dps/MobArmory/refs/heads/main/src/assets/psmoba/textures/item/armor/wither_skeleton_chestplate.png',
            (gs) => {
                const statNames = Object.values(StatNames);
                const doubleStatName = statNames[Math.floor(Math.random() * statNames.length)];
                const halveStatName = statNames.filter(sn => sn !== doubleStatName)[Math.floor(Math.random() * (statNames.length - 1))];
                gs.player.current.stats[doubleStatName].mult.push(2);
                gs.player.current.stats[halveStatName].mult.push(.5);
                if (doubleStatName === StatNames.health) {
                    gs.player.current.health *= 2;
                }
                if (halveStatName === StatNames.health) {
                    gs.player.current.health /= 2;
                }
            },
            (gs, d, et) => {
                if (et % 10 - d >= 0) return; // only run once every 10 seconds
                console.log('10s');
            },
        ),
        new Item(
            'thorns',
            'Thorns',
            'Deal damage to enemies that hit you',
            'https://raw.githubusercontent.com/ps-dps/MobArmory/refs/heads/main/src/assets/psmoba/textures/item/armor/wither_skeleton_leggings.png',
            () => {},
            () => {},
        ),
    ]);
    const [statScreenMaximized, setStatScreenMaximized] = useState(false);
    const [, forceUpdate] = useState({});
    const preventDefaultKeys = useMemo(() => ['w', 'a', 's', 'd', ' ', 'Tab'], []);
    const spawnEnemyCooldown = useRef(0);

    const [gameState, setGameState] = useState<GameState>({
        player: useRef<Player>(new Player(
            {x: 0, y: 0, r: 2.4},
            getBaseStats({
                health: 100,
                speed: 10,
                autoDamage: 10,
                autoSpeed: 10,
                iFrames: 10,
                piercing: 0,
            }),
            () => {
                setAvailableUpgrades([
                    getRandomUpgrade(),
                    getRandomUpgrade(),
                    getRandomUpgrade(),
                ]);
                isPaused.current = true;
            },
            () => mousePosition.current,
            () => {
                if (!isUsingJoystick.current) {
                    playerMoveDirection.current = {
                        x: (isKeyPressed.current['a'] ? 1 : 0) - (isKeyPressed.current['d'] ? 1 : 0),
                        y: (isKeyPressed.current['w'] ? 1 : 0) - (isKeyPressed.current['s'] ? 1 : 0),
                    }
                }
                return playerMoveDirection.current
            },
        )),
        objects: [],
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
        const handleTouchStart = () => setIsTouchDevice(true);
        window.addEventListener('touchstart', handleTouchStart);
        return () => window.removeEventListener('touchstart', handleTouchStart);
    }, []);

    /*  Handle Movement and Render Frame  */
    const gameLoop = useCallback(() => {
        const timestamp = performance.now();
        const delta = Math.abs(lastTimestamp.current - timestamp) / 1000;
        lastTimestamp.current = timestamp;
        totalTimeElapsed.current += delta;

        if (!isPaused.current) {
            gameState.objects.filter(implementsTickable).map(o => o as any as Tickable).forEach(obj => obj.onTick(gameState, delta, totalTimeElapsed.current));
            gameState.player.current.onTick(gameState, delta, totalTimeElapsed.current);

            if (spawnEnemyCooldown.current > 0) spawnEnemyCooldown.current -= delta;
            if (spawnEnemyCooldown.current <= 0) {
                spawnEnemyCooldown.current = 2;
                const randomAngle = Math.PI * Math.random() * 2;
                gameState.objects.push(new Entity(
                    { x: gameState.player.current.position.x + 80 * Math.cos(randomAngle), y: gameState.player.current.position.y + 80 * Math.sin(randomAngle), r: 1.6 },
                    getBaseStats({ health: 15, speed: 8, autoDamage: 2, iFrames: 10 }),
                    'enemy',
                ));
            }
        }
        document.documentElement.style.setProperty('--player-x-mod', `${gameState.player.current.position.x % 16}px`);
        document.documentElement.style.setProperty('--player-y-mod', `${gameState.player.current.position.y % 16}px`);
        setGameState({...gameStateRef.current});

        setTimeout(gameLoop, 1000 / fps.current);
    }, []);

    useEffect(() => {
        document.documentElement.style.setProperty('--player-x-mod', '0px');
        document.documentElement.style.setProperty('--player-y-mod', '0px');
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
        <div className='section'>
            <h2>How to play</h2>
            <p>
                Use the <b>WASD</b> keys to move around and the <b>mouse</b> to aim your shot.
                If you are on a <b>touch device</b>, you can use the <b>joystick</b> at the bottom of the screen to move around.
            </p>
        </div>
        <div
            className={`game_window${isFullscreen.current ? ' fullscreen' : ''}${isPaused.current ? ' paused' : ''}`}
            ref={gameWindow}
            onContextMenu={e => e.preventDefault()}
            onTouchStart={e => {
                window.getSelection()?.removeAllRanges();
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
            onTouchEnd={() => {
                window.getSelection()?.removeAllRanges();
            }}
        >
            <div className='game_elements'>
                <div className='background' />
                {screenSize && gameState.objects.map((d, i) => {
                    const {key, className, style} = d.render(i, gameState.player.current.position, scale.current, {height: screenSize.height / 2, width: screenSize.width / 2});
                    return (<div key={key} className={className} style={style} />)
                })}
                <div className={[...gameState.player.current.visualFlags, 'player'].join(' ')} />
            </div>
            <div className='hud'>
                {screenSize && <div className='cursor' style={{
                    left: mousePosition.current.x * scale.current + screenSize.width / 2,
                    top: mousePosition.current.y * scale.current + screenSize.height / 2,
                }} />}
                <div className='hud_top'>
                    <div className='bars'>
                        <span>Health: {roundWithPrecision(gameState.player.current.health, 100)} | Level: {gameState.player.current.level}</span>
                        <div className='health_background' style={{width: `${getStatTotal(gameState.player.current.stats.health)}px`}}>
                            <div className='health_bar' style={{width: `${100 * gameState.player.current.health / getStatTotal(gameState.player.current.stats.health)}%`}} />
                        </div>
                        <div className='xp_background' style={{width: gameState.player.current.xpToNextLevel}}>
                            <div className='xp_bar' style={{width: `${100 * gameState.player.current.xp / gameState.player.current.xpToNextLevel}%`}} />
                        </div>
                    </div>
                    <div className='buttons'>
                        <button onClick={() => {
                                isPaused.current = !isPaused.current;
                                forceUpdate({});
                            }}>
                            {isPaused.current ? <PlayIcon /> : <PauseIcon />}
                        </button>
                        {isPaused.current && <button onClick={() => {
                            isFullscreen.current = !isFullscreen.current;
                            setTimeout(() => setGameState(gs => ({...gs})), 1); // timeout of 1 to wait for fullscreen to take effect
                            forceUpdate({});
                        }}>
                            <ArrowsFullscreenIcon />
                        </button>}
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
                        window.getSelection()?.removeAllRanges();
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
                        window.getSelection()?.removeAllRanges();
                        playerMoveDirection.current = {x: 0, y: 0};
                        isUsingJoystick.current = false;
                    }}
                >
                    <ChevronLeftIcon className='joystick_button' onTouchStart={() => setIsJoystickLeft(l => !l)} />
                </div>}
                <button className={`stat_toggle${statScreenMaximized ? ' stat_minimize_rotate' : ''}`} onClick={() => setStatScreenMaximized(b => !b)}>
                    <ArrowRightIcon />
                </button>
                {(statScreenMaximized || isKeyPressed.current['Tab']) && (
                    <div className='stat_screen'>
                        {statScreenMaximized && <button className='stat_minimize' onClick={() => setStatScreenMaximized(false)}>
                            <CloseIcon />
                        </button>}
                        <h2>Stats</h2>
                        {Object.entries(gameState.player.current.stats).map(([stat_name, stat], i) => {
                            const readable_stat_name = statToStatName(stat_name as keyof Stats);
                            const formatted_stat = getStatFormatted(stat_name as keyof Stats, stat);
                            return (
                                <div className='stat' key={`stat_${i}`}>
                                    {statToIcon(stat_name as keyof Stats)}
                                    <span className='stat_title'>{readable_stat_name}</span>
                                    <div className='stat_value'>
                                        {formatted_stat.map((s, j) => <span key={`stat_${i}_${j}`}>{s}</span>)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            {availableItems.length && <div className='item_menu'>
                <div className='item_cards'>
                    {availableItems.map((item, i) => (
                        <div className='item_card' key={`item_${i}`}>
                            <img alt={`${item.name} Icon`} src={item.icon}/>
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <button
                                onClick={() => {
                                    gameState.player.current.items.push(item);
                                    item.onPickup(gameState);
                                    setAvailableItems([]);
                                    isPaused.current = false;
                                }}
                            >Get</button>
                        </div>
                    ))}
                </div>
            </div>}
            {availableUpgrades.length && <div className='upgrade_menu'>
                <div className='upgrade_cards'>
                    {availableUpgrades.map((upgrade, i) => (
                        <label className={`upgrade_card ${['common', 'rare', 'epic'][upgrade.rarity]}`} key={`upgrade_${i}`} htmlFor={`upgrade_${i}`}>
                            {upgrade.icon}
                            <h3>{upgrade.stat_name}</h3>
                            <p>+ {roundWithPrecision(upgrade.increase, 100)}{upgrade.type === 'mult' ? '%' : ''}</p>
                            <p>{roundWithPrecision(getStatTotal(gameState.player.current.stats[upgrade.stat]), 100)} &gt; <span className='to_stat'>{upgrade.type === 'flat' ? roundWithPrecision(getStatTotal(gameState.player.current.stats[upgrade.stat], upgrade.increase), 100) : roundWithPrecision(getStatTotal(gameState.player.current.stats[upgrade.stat], 0, (1 + upgrade.increase / 100)), 100)}</span></p>
                            <input
                                type='checkbox'
                                id={`upgrade_${i}`}
                                checked={checkedUpgrade === i}
                                onChange={() => setCheckedUpgrade(checkedUpgrade === i ? null : i)}
                            />
                        </label>
                    ))}
                </div>
                <button
                    className='upgrade_button'
                    onClick={() => {
                        if (checkedUpgrade === null) return;
                        const upgrade = availableUpgrades[checkedUpgrade];
                        const previousPlayerHealthStat = getStatTotal(gameState.player.current.stats.health);
                        if (upgrade.type === 'flat') {
                            gameState.player.current.stats[upgrade.stat][upgrade.type] += upgrade.increase;
                        } else {
                            gameState.player.current.stats[upgrade.stat][upgrade.type].push(1 + upgrade.increase / 100);
                        }
                        if (upgrade.stat === 'health') {
                            gameState.player.current.health += (getStatTotal(gameState.player.current.stats.health) - previousPlayerHealthStat);
                        }
                        setCheckedUpgrade(null);
                        setAvailableUpgrades([]);
                        isPaused.current = false;
                    }}
                >
                    Upgrade!
                </button>
            </div>}
        </div>
    </main>);
}

export default Survive;
