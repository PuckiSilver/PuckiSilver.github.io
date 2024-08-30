import { getStatTotal, implementsDamageable, moveAlongVector, moveTowardsPosition } from "./Utils";

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
    rarity: 0 | 1 | 2;
}

export type GameState = {
    player: React.MutableRefObject<Player>;
    objects: Displayable[];
}

export interface Displayable {
    nameId: string;
    visualFlags: string[];
    position: Position;
    render(i: number, ppos: {x: number, y: number}, sc: number, sz: {height: number, width: number}): {key: string, className: string, style: React.CSSProperties};
}

export interface Tickable {
    isTickable: true;
    onTick: (gs: GameState, delta: number) => void;
}

export interface Damageable {
    isDamageable: true;
    isEnemy: boolean;
    damage: (dmg: number, gs: GameState) => boolean;
}

export abstract class DisplayableImpl implements Displayable {
    nameId: string;
    visualFlags: string[];
    position: Position;

    constructor(nameId: string, position: Position, visualFlags: string[]) {
        this.nameId = nameId;
        this.position = position;
        this.visualFlags = visualFlags;
    }

    render(i: number, ppos: {x: number, y: number}, sc: number, sz: {height: number, width: number}): {key: string, className: string, style: React.CSSProperties} {
        return {
            key: `${this.nameId}_${i}`,
            className: [...this.visualFlags, this.nameId].join(' '),
            style: {
                left: (this.position.x - ppos.x) * sc + sz.width,
                top: (this.position.y - ppos.y) * sc + sz.height,
            }
        };
    };
}

export class Entity extends DisplayableImpl implements Damageable, Tickable {
    isTickable: true = true;
    isDamageable: true = true;
    autoCooldown: number = 0;
    invulTimeLeft: number = 0;
    isEnemy: boolean = true;
    stats: Stats;
    health: number;

    constructor(position: Position, stats: Stats, nameId: string) {
        super(nameId, position, []);
        this.stats = stats;
        this.health = getStatTotal(stats.health);
    }

    damage(dmg: number, gs: GameState) {
        if (this.invulTimeLeft > 0) {
            return false;
        }
        this.health -= dmg;
        this.visualFlags.push('damaged');
        if (this.health <= 0 && this.isEnemy) {
            gs.objects.push(new XPOrb(this.position.x, this.position.y, 10));
            gs.objects.splice(gs.objects.indexOf(this), 1);
        }
        this.invulTimeLeft = getStatTotal(this.stats.iFrames) / 60;
        return true;
    };

    onTick(gs: GameState, delta: number) {
        if (this.invulTimeLeft !== 0) {
            this.invulTimeLeft -= delta;
            if (this.invulTimeLeft <= 0) {
                this.invulTimeLeft = 0;
                this.visualFlags = this.visualFlags.filter(f => f !== 'damaged');
            }
        }

        const movementVector = moveTowardsPosition(
            this.position,
            gs.player.current.position,
            delta,
            getStatTotal(this.stats.speed),
            this.position.r + gs.player.current.position.r,
            () => {
                gs.player.current.damage(getStatTotal(this.stats.autoDamage), gs);
                return true;
            });
        this.position = {
            ...this.position,
            x: this.position.x - movementVector.x,
            y: this.position.y - movementVector.y,
        };
    };
}

export class Player extends Entity {
    xp: number = 0;
    level: number = 0;
    xpToNextLevel: number = 10 + (1 * 2) ** 1.2;
    isEnemy: boolean = false;
    levelUpCallback: () => void;
    getMousePosition: () => { x: number; y: number; };
    getPlayerMoveDirection: () => { x: number; y: number; };

    constructor(
        position: Position,
        stats: Stats,
        levelUpCallback: () => void,
        getMousePosition: () => { x: number; y: number; },
        getPlayerMoveDirection: () => { x: number; y: number; },
    ) {
        super(position, stats, 'player');
        this.levelUpCallback = levelUpCallback;
        this.getMousePosition = getMousePosition;
        this.getPlayerMoveDirection = getPlayerMoveDirection;
    }

    onTick(gs: GameState, delta: number) {
        if (this.invulTimeLeft !== 0) {
            // reduce iFrames
            this.invulTimeLeft -= delta;
            if (this.invulTimeLeft <= 0) {
                this.invulTimeLeft = 0;
                this.visualFlags = this.visualFlags.filter(f => f !== 'damaged');
            }
        }

        if (this.autoCooldown > 0) this.autoCooldown -= delta;
        if (this.autoCooldown <= 0) {
            // spawn bullet in mouse direction
            const mousePosition = this.getMousePosition();
            const mouseVectorLength = Math.sqrt(mousePosition.x ** 2 + mousePosition.y ** 2);
            if (mouseVectorLength > 0) {
                gs.objects.push(new Bullet(
                    {x: this.position.x, y: this.position.y, r: .2},
                    {x: mousePosition.x, y: mousePosition.y},
                    32,
                    getStatTotal(this.stats.autoDamage),
                    5,
                    getStatTotal(this.stats.piercing),
                    false,
                ));
                this.autoCooldown = 15 / getStatTotal(this.stats.autoSpeed);
            }
        }

        // move player
        const playerMoveDirection = this.getPlayerMoveDirection();
        const movementVector = moveAlongVector(playerMoveDirection, delta, getStatTotal(this.stats.speed) / 1);
        this.position = {
            ...this.position,
            x: this.position.x - movementVector.x,
            y: this.position.y - movementVector.y,
        };

        // collect xp
        gs.objects.filter(o => o instanceof XPOrb).map(o => o as XPOrb).forEach((orb) => {
            const distanceToPlayer = Math.sqrt((this.position.x - orb.position.x) ** 2 + (this.position.y - orb.position.y) ** 2);
            if (distanceToPlayer < this.position.r + orb.position.r) {
                this.xp += orb.xp;
                gs.objects.splice(gs.objects.indexOf(orb), 1);
            }
        });
        // level up
        while (this.xp >= this.xpToNextLevel) {
            this.xp -= this.xpToNextLevel;
            this.level++;
            this.xpToNextLevel = 10 + ((this.level + 1) * 2) ** 1.2;
            this.levelUpCallback();
        }
    };
}

export class Bullet extends DisplayableImpl implements Tickable {
    isTickable: true = true;
    damage: number;
    direction: {x: number, y: number};
    speed: number;
    timeAlive: number;
    piercing: number;
    isEnemy: boolean;

    constructor(
        position: Position,
        direction: {x: number, y: number},
        speed: number,
        damage: number,
        timeAlive: number,
        piercing: number,
        isEnemy: boolean,
    ) {
        super('bullet', position, []);
        this.direction = direction;
        this.speed = speed;
        this.damage = damage;
        this.timeAlive = timeAlive;
        this.piercing = piercing;
        this.isEnemy = isEnemy;
    }

    private reducePiercing() {
        if (this.piercing <= 0 || (this.piercing < 1 && Math.random() > this.piercing)) {
            this.timeAlive = 0;
        }
        this.piercing --;
    }

    onTick(gs: GameState, delta: number) {
        const movementVector = moveAlongVector(this.direction, delta, this.speed);
        this.position = {
            ...this.position,
            x: this.position.x + movementVector.x,
            y: this.position.y + movementVector.y,
        };

        if (this.isEnemy) {
            const distanceToPlayer = Math.sqrt((this.position.x - gs.player.current.position.x) ** 2 + (this.position.y - gs.player.current.position.y) ** 2);
            if (distanceToPlayer < this.position.r + gs.player.current.position.r && gs.player.current.damage(this.damage, gs)) {
                this.reducePiercing();
            }
        } else {
            gs.objects
                .filter(e => implementsDamageable(e) && e.isEnemy)
                .map(e => e as Displayable & Damageable)
                .forEach(e => {
                    const distanceToEntity = Math.sqrt((this.position.x - e.position.x) ** 2 + (this.position.y - e.position.y) ** 2);
                    if (distanceToEntity < this.position.r + e.position.r && e.damage(this.damage, gs)) {
                        this.reducePiercing();
                    }
            });
        }

        this.timeAlive -= delta;
        if (this.timeAlive <= 0) {
            gs.objects = gs.objects.filter((obj) => obj !== this);
        }
    };
}

export class XPOrb extends DisplayableImpl {
    xp: number;

    constructor(x: number, y: number, xp: number) {
        super('xp_orb', {x,y,r:.4}, []);
        this.xp = xp;
    }
}
