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
    iFrames = "iFrames",
}

export type Stats = {
    [key in keyof typeof StatNames]: Stat;
}

export type GameState = {
    player: React.MutableRefObject<Entity>;
    enemies: Entity[];
    bullets: Entity[];
}

export class Entity {
    position: Position;
    stats: Stats;
    health: number;
    iFramesLeft: number;
    motion: {x: number, y: number} = {x: 0, y: 0};
    onTick: (entity: Entity, gameState: GameState, delta: number) => void;
    onDeath: (entity: Entity, gameState: GameState) => void;

    constructor(position: Position, stats: Stats, onTick: (entity: Entity, gameState: GameState, delta: number) => void, onDeath: (entity: Entity, gameState: GameState) => void, motion?: {x: number, y: number}) {
        this.position = position;
        this.stats = stats;
        this.onTick = onTick;
        this.onDeath = onDeath;
        this.health = getStatTotal(stats.health);
        this.iFramesLeft = 0;
        if (motion) {
            this.motion = motion;
        }
    }
}
