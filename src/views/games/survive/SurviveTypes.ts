import { getStatTotal } from "./Utils";

export type Position = {
    x: number;
    y: number;
    r: number;
}

export type Stat = {
    base: number;
    flat: number;
    mult: number[];
}

export enum StatNames {
    health = "health",
    speed = "speed",
    autoDamage = "autoDamage",
    autoSpeed = "autoSpeed",
    iFrames = "iFrames",
    piercing = "piercing",
}

export type Stats = {
    [key in keyof typeof StatNames]: Stat;
}

export type Upgrade = {
    stat: keyof typeof StatNames;
    increase: number;
    type: 'flat' | 'mult';
    icon: JSX.Element;
    stat_name: string;
    rarity: number;
}

export type GameState = {
    player: React.MutableRefObject<Player>;
    enemies: Entity[];
    bullets: Bullet[];
    xpOrbs: XPOrb[];
}

export class Entity {
    position: Position;
    stats: Stats;
    health: number;
    motion: {x: number, y: number} = {x: 0, y: 0};
    onTick: (entity: Entity, gameState: GameState, delta: number) => void;
    onDeath: (entity: Entity, gameState: GameState) => void;
    autoCooldownTicks: number = 0;
    iFramesLeft: number = 0;

    constructor(position: Position, stats: Stats, onTick: (entity: Entity, gameState: GameState, delta: number) => void, onDeath: (entity: Entity, gameState: GameState) => void, motion?: {x: number, y: number}) {
        this.position = position;
        this.stats = stats;
        this.onTick = onTick;
        this.onDeath = onDeath;
        this.health = getStatTotal(stats.health);
        if (motion) {
            this.motion = motion;
        }
    }
}

export class Player extends Entity {
    xp: number = 0;
    level: number = 0;
    xpToNextLevel: number = 10 + (1 * 2) ** 1.2;
}

export class Bullet {
    position: Position;
    damage: number;
    motion: {x: number, y: number};
    ticksAlive: number;
    onTick: (entity: Bullet, gameState: GameState, delta: number) => void;
    piercing: number;

    constructor(
        position: Position,
        motion: {x: number, y: number},
        damage: number,
        ticksAlive: number,
        onTick: (entity: Bullet, gameState: GameState, delta: number) => void,
        piercing: number,
    ) {
        this.position = position;
        this.motion = motion;
        this.damage = damage;
        this.ticksAlive = ticksAlive;
        this.onTick = onTick;
        this.piercing = piercing;
    }
}

export class XPOrb {
    position: Position;
    xp: number;

    constructor(position: Position, xp: number) {
        this.position = position;
        this.xp = xp;
    }
}
