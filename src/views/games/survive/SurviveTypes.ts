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
    iFrames = "iFrames"
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
    onTick: (entity: Entity, gameState: GameState, delta: number) => void;

    constructor(position: Position, stats: Stats, onTick: (entity: Entity, gameState: GameState, delta: number) => void) {
        this.position = position;
        this.stats = stats;
        this.onTick = onTick;
        this.health = getStatTotal(stats.health);
        this.iFramesLeft = 0;
    }
}
