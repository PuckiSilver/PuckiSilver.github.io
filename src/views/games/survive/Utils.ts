import { Entity, GameState, Stat, StatNames, Stats, Upgrade } from "./SurviveTypes";
import FastForwardIcon from "../../../icons/fast-forward";
import ShieldIcon from "../../../icons/shield";
import StarIcon from "../../../icons/star";

const statToStatName = (stat: keyof Stats): string => {
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
}

const statToIcon = (stat: keyof Stats): JSX.Element => {
    switch (stat) {
        // case StatNames.health:
        // case StatNames.speed:
        // case StatNames.autoDamage:
        case StatNames.autoSpeed:
            return FastForwardIcon();
        case StatNames.iFrames:
            return ShieldIcon();
        // case StatNames.piercing:
    }
    return StarIcon({});
}

export const getRandomUpgrade = (): Upgrade => {
    const stat = Object.values(StatNames)[Math.floor(Math.random() * Object.values(StatNames).length)];
    const increase = Math.random() * 5;
    const type = Math.random() > 0.5 ? 'flat' : 'mult';
    const rarityRng = Math.random();
    const rarity = rarityRng > 0.9 ? 2 : rarityRng > 0.7 ? 1 : 0;
    const rarityBonus = rarity === 2 ? 5 : rarity === 1 ? 2 : 0;
    return {
        stat,
        increase: increase + rarityBonus,
        type,
        icon: statToIcon(stat),
        stat_name: statToStatName(stat),
        rarity: rarity,
    };
}

export const roundWithPrecision = (num: number, precision: number): number => {
    return Math.round(num * precision) / precision;
}

export const getStatTotal = (stat: Stat, flat_increase: number = 0, mult_increase: number = 1): number => {
    return (stat.base + stat.flat + flat_increase) * [...stat.mult, mult_increase].reduce((acc, val) => acc * val, 1);
}

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
}

export const damageEntity = (entity: Entity, damage: number, gameState: GameState): boolean => {
    if (entity.iFramesLeft > 0) {
        return false;
    }
    entity.health -= damage;
    console.log(entity.health);
    if (entity.health <= 0) {
        entity.onDeath(entity, gameState);
    }
    entity.iFramesLeft = getStatTotal(entity.stats.iFrames);
    return true;
}
