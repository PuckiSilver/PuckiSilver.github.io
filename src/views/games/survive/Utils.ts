import { Entity, Stat, StatNames, Stats } from "./SurviveTypes";

export const getStatTotal = (stat: Stat): number => {
    return (stat.base + stat.flat) * stat.mult.reduce((acc, val) => acc * val, 1);
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

export const damageEntity = (entity: Entity, damage: number): void => {
    if (entity.iFramesLeft > 0) {
        return;
    }
    entity.health -= damage;
    console.log(entity.health);
    entity.iFramesLeft = getStatTotal(entity.stats.iFrames);
}
