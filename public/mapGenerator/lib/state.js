import FloofMap from "./FloofMap.js";
import { mainCellTypes, MobSpawner } from "./types.js";

export let brush = mainCellTypes.find(m => m.name === "Mob Spawn");
export function setBrush(brushType) {
    brush = brushType;
}

export let brushWidth = 1;
export function setBrushWidth(width) {
    brushWidth = width;
}

export let selectedMobSpawner = null;

/** @param {MobSpawner} spawner */
export function selectMobSpawner(spawner) {
    if (spawner == null) {
        selectedMobSpawner = null;
        return;
    }
    
    selectedMobSpawner = spawner.id;
}

export const map = new FloofMap(64, 64);