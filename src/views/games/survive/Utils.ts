import { Damageable, Item, Player, Stat, StatNames, Stats, Tickable, Upgrade } from "./SurviveTypes";
import ForwardIcon from "../../../icons/forward";
import ShieldIcon from "../../../icons/shield";
import StarIcon from "../../../icons/star";
import HeartIcon from "../../../icons/heart";
import ArrowRightIcon from "../../../icons/arrow-right";
import HammerIcon from "../../../icons/hammer";
import ThunderIcon from "../../../icons/thunder";

export const statToStatName = (stat: string): string => {
    switch (stat) {
        case StatNames.health:
            return 'Health';
        case StatNames.speed:
            return 'Movement Speed';
        case StatNames.autoDamage:
            return 'Attack Damage';
        case StatNames.autoSpeed:
            return 'Attack Speed';
        case StatNames.iFrames:
            return 'Invincibility Frames';
        case StatNames.piercing:
            return 'Piercing';
    }
    return '';
};

export const statToIcon = (stat: keyof Stats): JSX.Element => {
    switch (stat) {
        case StatNames.health:
            return HeartIcon();
        case StatNames.speed:
            return ThunderIcon();
        case StatNames.autoDamage:
            return HammerIcon();
        case StatNames.autoSpeed:
            return ForwardIcon();
        case StatNames.iFrames:
            return ShieldIcon();
        case StatNames.piercing:
            return ArrowRightIcon();
    }
    return StarIcon({});
};

export const getRandomUpgrade = (): Upgrade => {
    const flatStatBounds = {
        [StatNames.health]:     [1, 30],
        [StatNames.speed]:      [1, 6],
        [StatNames.autoDamage]: [1, 5],
        [StatNames.autoSpeed]:  [1, 8],
        [StatNames.iFrames]:    [1, 10],
        [StatNames.piercing]:   [1, 3],
    };
    const multStatBounds = {
        [StatNames.health]:     [0.3, 2],
        [StatNames.speed]:      [0.3, 2],
        [StatNames.autoDamage]: [0.3, 2],
        [StatNames.autoSpeed]:  [0.3, 2],
        [StatNames.iFrames]:    [0.3, 2],
    };
    const isFlat = Math.random() < 0.7; // 70% chance of being flat
    const availableStats = isFlat ? Object.keys(flatStatBounds) : Object.keys(multStatBounds);
    const stat = availableStats[Math.floor(Math.random() * availableStats.length)];
    const weightedRandom = Math.random() ** 3; // weighted -- lower values are more likely
    const rarity = weightedRandom > 0.667 ? 2 : weightedRandom > 0.333 ? 1 : 0;

    const increaseArray = isFlat ? flatStatBounds[stat as keyof typeof flatStatBounds] : multStatBounds[stat as keyof typeof multStatBounds];
    const increase = increaseArray[0] + weightedRandom * (increaseArray[1] - increaseArray[0]);

    return {
        stat: stat as keyof typeof StatNames,
        increase: increase,
        type: isFlat ? 'flat' : 'mult',
        icon: statToIcon(stat as keyof Stats),
        stat_name: statToStatName(stat as keyof Stats),
        rarity: rarity,
    };
};

export const containsItem = (items: Item[], id: string): boolean => {
    return items.some(item => item.id === id);
}

export const getAvailableItems = (player: Player): Item[] => {
    const availableItems = [
        new Item(
            'aoe_damage',
            'AoE Damage',
            'Deals damage in a small area around the player',
            'IMAGE',
            () => {},
            () => {},
        )
    ];
    return availableItems
}

export const roundWithPrecision = (num: number, precision: number): number => {
    return Math.round(num * precision) / precision;
};

export const getStatTotal = (stat: Stat, flat_increase: number = 0, mult_increase: number = 1): number => {
    return (stat.base + stat.flat + flat_increase) * [...stat.mult, mult_increase].reduce((acc, val) => acc * val, 1);
};

export const getBaseStats = (partialStats: {[key in keyof Stats]?: number}): Stats => {
    const stats: { -readonly [key in keyof Stats]: Stats[key] } = {} as { -readonly [key in keyof Stats]: Stats[key] };

    for (const key of Object.values(StatNames)) {
        stats[key] = {
            base: 0,
            flat: 0,
            mult: [],
        };
    }
    for (const [key, value] of Object.entries(partialStats)) {
        if (value === undefined) {
            continue;
        }
        stats[key as keyof Stats].base = value;
    }

    return stats as Stats;
};

export const setVectorLength = (vector: { x: number, y: number }, length: number): { x: number, y: number } => {
    const vectorLength = Math.sqrt(vector.x ** 2 + vector.y ** 2);
    return {
        x: (vector.x / vectorLength) * length,
        y: (vector.y / vectorLength) * length,
    }
}

export const moveAlongVector = (vector: { x: number, y: number }, delta: number, speed: number, vectorLength?: number): { x: number, y: number } => {
    if (vector.x === 0 && vector.y === 0) {
        return {x:0, y:0};
    }
    if (vectorLength === undefined) {
        vectorLength = Math.sqrt(vector.x ** 2 + vector.y ** 2);
    }
    return {
        x: (vector.x / vectorLength) * delta * speed,
        y: (vector.y / vectorLength) * delta * speed,
    }
};

export const moveTowardsPosition = (from: {x: number, y: number}, to: {x: number, y: number}, delta: number, speed: number, collisionRadius: number, onCollision: () => boolean): { x: number, y: number } => {
    const movementVector = {x: from.x - to.x, y: from.y - to.y};
    const vectorLength = Math.sqrt(movementVector.x ** 2 + movementVector.y ** 2);
    if (vectorLength < collisionRadius && onCollision()) {
        return {x: 0, y: 0};
    };
    return moveAlongVector(movementVector, delta, speed);
};

export const getStatFormatted = (stat_name: keyof Stats, stat: Stat): string[] => {
    // const formattedStat: string[] = [`Base: ${stat.base}`];
    const formattedStat: string[] = [`${roundWithPrecision(getStatTotal(stat), 100)}`];
    switch (stat_name) {
        case StatNames.autoSpeed:
            formattedStat.push(`(${roundWithPrecision(getStatTotal(stat) / 15, 100)} a/s)`);
            break;
        case StatNames.iFrames:
            formattedStat.push(`(${roundWithPrecision(getStatTotal(stat) / 60, 100)} s)`);
            break;
        case StatNames.piercing:
            const roundedStat = roundWithPrecision(getStatTotal(stat), 100);
            formattedStat.push(`(${Math.floor(roundedStat)} + ${Math.round((roundedStat % 1) * 100)} %)`);
            break;
    }
    return formattedStat;
}

export const implementsDamageable = (obj: any): obj is Damageable => {
    return obj.isDamageable === true;
};

export const implementsTickable = (obj: any): obj is Tickable => {
    return obj.isTickable === true;
};
