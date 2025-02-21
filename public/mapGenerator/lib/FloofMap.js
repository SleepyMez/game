import * as gameConfigs from "../../server/lib/config.js";
import Pathfinder from "./Pathfinder.js";
import { selectedMobSpawner } from "./state.js";
import { mainCellTypes, MobSpawner } from "./types.js";

/** @type {Map<number, MobSpawner>} */
export const spawners = new Map();

export class MapCell {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.type = 0;
        this.score = 0;

        /** @type {MobSpawner} */
        this.mobSpawner = null;
    }
}

export default class FloofMap {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        /** @type {MapCell[][]} */
        this.cells = new Array(height).fill(null).map((_, y) => new Array(width).fill(null).map((_, x) => new MapCell(x, y)));

        this.maxRarity = gameConfigs.tiers.length - 3;
    }

    at(x, y) {
        return this.cells[y][x];
    }

    set(x, y, type = 0) {
        this.cells[y][x].type = type;

        if (mainCellTypes[type].name === "Mob Spawn" && selectedMobSpawner !== null) {
            this.cells[y][x].mobSpawner = spawners.get(selectedMobSpawner);
        } else {
            this.cells[y][x].mobSpawner = null;
        }
    }

    checkSpawners() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.cells[y][x];

                if (cell.mobSpawner !== null && !spawners.has(cell.mobSpawner.id)) {
                    cell.mobSpawner = null;
                }
            }
        }
    }

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(canvas, ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const size = Math.min(canvas.width, canvas.height);
        const cellSize = size / Math.max(this.width, this.height);

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.cells[y][x];

                ctx.fillStyle = mainCellTypes[cell.type].color;
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

                if (cell.mobSpawner !== null) {
                    ctx.strokeStyle = cell.mobSpawner.color;
                    ctx.lineWidth = 1;
                    ctx.beginPath();

                    ctx.moveTo(x * cellSize, y * cellSize);
                    ctx.lineTo(x * cellSize + cellSize, y * cellSize + cellSize);

                    ctx.moveTo(x * cellSize + cellSize / 2, y * cellSize);
                    ctx.lineTo(x * cellSize + cellSize, y * cellSize + cellSize / 2);

                    ctx.moveTo(x * cellSize, y * cellSize + cellSize / 2);
                    ctx.lineTo(x * cellSize + cellSize / 2, y * cellSize + cellSize);

                    ctx.stroke();
                }

                if (cell.score > 0) {
                    ctx.fillStyle = gameConfigs.tiers[Math.round(cell.score * this.maxRarity)].color;
                    ctx.fillRect(x * cellSize + cellSize / 4, y * cellSize + cellSize / 4, cellSize / 2, cellSize / 2);
                }
            }
        }
    }

    resize(width, height) {
        const newCells = new Array(height).fill(null).map((_, y) => new Array(width).fill(null).map((_, x) => new MapCell(x, y)));

        for (let y = 0; y < Math.min(this.height, height); y++) {
            for (let x = 0; x < Math.min(this.width, width); x++) {
                newCells[y][x] = this.cells[y][x];
            }
        }

        this.width = width;
        this.height = height;
        this.cells = newCells;
    }

    scoreCells() {
        let maxScore = 0;

        const neighbors = (x, y) => {
            const n = [];

            if (x > 0) {
                n.push(this.cells[y][x - 1]);
            }

            if (x < this.width - 1) {
                n.push(this.cells[y][x + 1]);
            }

            if (y > 0) {
                n.push(this.cells[y - 1][x]);
            }

            if (y < this.height - 1) {
                n.push(this.cells[y + 1][x]);
            }

            return n;
        }

        let spawnX = -1,
            spawnY = -1;

        outer: for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.cells[y][x];

                if (cell.type === 1) {
                    spawnX = x;
                    spawnY = y;
                    break outer;
                }
            }
        }

        if (spawnX === -1 || spawnY === -1) {
            alert("Map does not contain a spawn point.");
            throw new Error("Map does not contain a spawn point.");
        }

        const knownPositions = new Set();
        const pathfinder = new Pathfinder(this);

        const scoreCell = (x, y) => {
            const cell = this.cells[y][x];
            const position = `${x},${y}`;

            if (knownPositions.has(position)) {
                return;
            }

            knownPositions.add(position);

            if (cell.type === 0) {
                return;
            }

            if (cell.type === 3) {
                cell.score = pathfinder.findPath(spawnX, spawnY, x, y).length;
                maxScore = Math.max(maxScore, cell.score);
            }

            for (const neighbor of neighbors(x, y)) {
                scoreCell(neighbor.x, neighbor.y);
            }
        }

        scoreCell(spawnX, spawnY);

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.cells[y][x].score /= maxScore;
            }
        }
    }

    static deserialize(inputJSON) {
        const input = JSON.parse(inputJSON);
        const map = new FloofMap(input.width, input.height);

        input.mobSpawners.forEach(s => {
            spawners.set(s.id, MobSpawner.deserialize(s));
        });

        input.cells.forEach(c => {
            map.set(c.x, c.y, c.type);

            if (c.spawn !== null) {
                map.cells[c.y][c.x].mobSpawner = spawners.get(c.spawn);
            }

            if (c.score !== null) {
                map.cells[c.y][c.x].score = c.score;
            }
        });

        return map;
    }

    serialize() {
        const output = {
            width: this.width,
            height: this.height,
            cells: [],
            mobSpawners: [],
            maxRarity: this.maxRarity
        };

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.cells[y][x];

                const cellObject = {
                    x: x,
                    y: y,
                    type: cell.type
                };

                if (cell.mobSpawner !== null) {
                    cellObject.spawn = cell.mobSpawner.id;
                }

                if (cell.type === 3) {
                    cellObject.score = cell.score;
                }

                output.cells.push(cellObject);

                if (cell.mobSpawner !== null && output.mobSpawners.findIndex(s => s.id === cell.mobSpawner.id) === -1) {
                    output.mobSpawners.push(cell.mobSpawner.serialize());
                }
            }
        }

        return JSON.stringify(output);
    }

    deserialize(inputJSON) {
        const input = JSON.parse(inputJSON);

        this.resize(input.width, input.height);
        this.maxRarity = input.maxRarity;

        input.mobSpawners.forEach(s => {
            spawners.set(s.id, MobSpawner.deserialize(s));
        });

        input.cells.forEach(c => {
            this.set(c.x, c.y, c.type);

            if (c.spawn != null) {
                this.cells[c.y][c.x].mobSpawner = spawners.get(c.spawn);
            } else {
                this.cells[c.y][c.x].mobSpawner = null;
            }

            if (c.score != null) {
                this.cells[c.y][c.x].score = c.score;
            } else {
                this.cells[c.y][c.x].score = 0;
            }
        });
    }
}