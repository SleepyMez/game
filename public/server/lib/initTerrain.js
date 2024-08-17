import { BIOME_TYPES, ENTITY_TYPES, SIDE_FLAGS } from "../../lib/protocol.js";
import { Terrain } from "./Entity.js";
import state from "./state.js";

const MAP_TYPES = {
    standard: "/server/maps/standard.json",
    antHell: "/server/maps/antHell.json",
    desert: "/server/maps/desert.json",
    pvp: "/server/maps/pvp.json",
    ocean: "/server/maps/ocean.json",
    hell: "/server/maps/hell.json",
    sewers: "/server/maps/sewers.json"
};

let mapSrc = MAP_TYPES.standard,
    map = [];

export default async function initTerrain(type) {
    switch (type) {
        case BIOME_TYPES.DEFAULT:
        case BIOME_TYPES.GARDEN:
            mapSrc = MAP_TYPES.standard;
            break;
        case BIOME_TYPES.DESERT:
            mapSrc = MAP_TYPES.desert;
            break;
        case BIOME_TYPES.OCEAN:
            mapSrc = MAP_TYPES.ocean;
            break;
        case BIOME_TYPES.ANT_HELL:
            mapSrc = MAP_TYPES.antHell;
            break;
        case BIOME_TYPES.HELL:
            mapSrc = MAP_TYPES.hell;
            break;
        case BIOME_TYPES.SEWERS:
            mapSrc = MAP_TYPES.sewers;
            break;
        default:
            throw new Error("Invalid biome type");
    }

    if (typeof mapSrc === "string") {
        const response = await fetch(mapSrc);
        map = await response.json();
    } else {
        map = mapSrc;
    }

    const generator = {
        width: map.length,
        height: map[0].length,
        get: (x, y) => map[x][y]
    };

    state.terrainGridWidth = generator.width;
    state.terrainGridHeight = generator.height;

    const size = state.width / state.terrainGridWidth / 2;

    const spawns = {
        [ENTITY_TYPES.PLAYER]: [],
        [ENTITY_TYPES.MOB]: []
    };

    let spawnX = 0,
        spawnY = 0;

    exit: for (let i = 0; i < generator.width; i++) {
        for (let j = 0; j < generator.height; j++) {
            if (generator.get(i, j) === 2) {
                spawnX = i;
                spawnY = j;

                break exit;
            }
        }
    }

    for (let i = 0; i < generator.width; i++) {
        for (let j = 0; j < generator.height; j++) {
            if (generator.get(i, j) === 1) {
                let top = j <= 0 || generator.get(i, j - 1) === 1,
                    right = i >= generator.width - 1 || generator.get(i + 1, j) === 1,
                    bottom = j >= generator.height - 1 || generator.get(i, j + 1) === 1,
                    left = i <= 0 || generator.get(i - 1, j) === 1;

                let flags = 0;

                if (!top) {
                    flags |= SIDE_FLAGS.TOP;
                }

                if (!right) {
                    flags |= SIDE_FLAGS.RIGHT;
                }

                if (!bottom) {
                    flags |= SIDE_FLAGS.BOTTOM;
                }

                if (!left) {
                    flags |= SIDE_FLAGS.LEFT;
                }

                const object = new Terrain({
                    x: (i - state.terrainGridWidth / 2 + .5) * size * 2,
                    y: (j - state.terrainGridWidth / 2 + .5) * size * 2
                }, size, flags);

                object.gridX = i;
                object.gridY = j;
            } else {
                const spawn = {
                    x: (i / state.terrainGridWidth) - .5,
                    y: (j / state.terrainGridHeight) - .5,
                    rarity: generator.get(i, j) > 2 ? generator.get(i, j) - 3 : 0
                };

                spawns[ENTITY_TYPES[generator.get(i, j) === 2 ? "PLAYER" : "MOB"]].push(spawn);
                state.maxMapDistFromSpawn = Math.max(state.maxMapDistFromSpawn, spawn.dist);
            }
        }
    }

    state.mapSpawns = spawns;
    state.mapData = map;

    state.updateTerrain();
}