import { MobSpawner } from "./types.js";

export class MapCell {
    static types = [{
        id: 0,
        name: "Wall",
        color: 0x000000
    }, {
        id: 1,
        name: "Player Spawn",
        color: 0xFFBE00
    }, {
        id: 2,
        name: "Checkpoint",
        color: 0xBEFF00
    }, {
        id: 3,
        name: "Mob Spawn",
        color: 0xFFFFFF
    }];

    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.type = 0;

        /** @type {MobSpawner} */
        this.mobSpawner = null;
    }
}

export default class FloofMap {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        /** @type {MapCell[][]} */
        this.cells = Array.from({ length: height }, (_, y) => Array.from({ length: width }, (_, x) => new MapCell(x, y)));
    }

    at(x, y) {
        return this.cells[y][x];
    }
}