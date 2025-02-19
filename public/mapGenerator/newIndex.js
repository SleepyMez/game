export * from "./lib/ui.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();

function loadImage(src) {
    const image = new Image();
    image.src = src;

    return new Promise((resolve, reject) => {
        image.onload = () => resolve(image);
        image.onerror = reject;
    });
}

class CellType {
    /** @type {CellType[]} */
    static cellTypes = [
        new CellType("Wall", 0x000000, -1),
        new CellType("Player Spawn", 0xFFF200, 1),
        new CellType("Mob Spawn", 0xFFFFFF, 2),
        new CellType("Checkpoint", 0xFF0000, 3)
    ];

    constructor(name, color, value) {
        this.name = name;
        this.color = color;
        this.value = value;

        /** @type {MobType | null} */
        this.mobType = null;
    }

    /** @returns {CellType} */
    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}

class MobType {
    /** @type {MobType[]} */
    static mobTypes = [];

    constructor(name, color, value, mobs) {
        this.name = name;
        this.color = color;
        this.value = value;
        this.mobs = mobs;
    }

    /** @returns {MobType} */
    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}

class MapCell {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        /** @type {CellType} */
        this.cellType = null;

        /** @type {MobType} */
        this.mobType = null;
    }
}

// Don't override to JavaScript's Map class
class FloofMap {
    static decodeImagePixel(color) {
        if (color instanceof Array || color instanceof Uint8ClampedArray || color instanceof Uint8Array) {
            const old = Array.from(color).join(", ");
            color = color[0] << 16 | color[1] << 8 | color[2];

            console.log(old, color);
        }

        for (const cellType of CellType.cellTypes) {
            if (cellType.color === color) {
                return cellType.clone();
            }
        }

        for (const mobType of MobType.mobTypes) {
            if (mobType.color === color) {
                return mobType.clone();
            }
        }

        return null; // throw new Error("Unknown encoding: " + color);
    }

    /** @param {Image} image */
    static fromImage(image) {
        console.log("Loading map from image (width: " + image.width + ", height: " + image.height + ")");

        const offscreen = new OffscreenCanvas(image.width, image.height);
        const ctx = offscreen.getContext("2d");

        const map = new FloofMap(image.width, image.height);

        ctx.drawImage(image, 0, 0, image.width, image.height);
        const imageData = ctx.getImageData(0, 0, image.width, image.height).data;

        const colorCounts = new Map();

        for (let i = 0; i < imageData.length; i += 4) {
            const x = (i / 4) % image.width;
            const y = Math.floor(i / (image.width * 4));
            const color = imageData[i] << 16 | imageData[i + 1] << 8 | imageData[i + 2];

            map.data[x][y] = new MapCell(x, y);
            map.data[x][y].cellType = FloofMap.decodeImagePixel(color);

            colorCounts.set(color, (colorCounts.get(color) ?? 0) + 1);
        }

        console.log(colorCounts);

        colorCounts.forEach((count, color) => {
            for (const cellType of CellType.cellTypes) {
                if (cellType.color === color) {
                    console.log(cellType.name + " (" + cellType.color + "): " + count);
                }
            }

            for (const mobType of MobType.mobTypes) {
                if (mobType.color === color) {
                    console.log(mobType.name + " (" + mobType.color + "): " + count);
                }
            }
        });

        return map;
    }

    constructor(width, height) {
        this.width = width;
        this.height = height;

        /** @type {MapCell[][]} */
        this.data = new Array(width).fill(null).map(() => new Array(height).fill(null));
    }

    neighbors(x, y, includeDiagonals = false) {
        const neighbors = [];

        if (x > 0) {
            neighbors.push(this.data[x - 1][y]);
        }

        if (x < this.width - 1) {
            neighbors.push(this.data[x + 1][y]);
        }

        if (y > 0) {
            neighbors.push(this.data[x][y - 1]);
        }

        if (y < this.height - 1) {
            neighbors.push(this.data[x][y + 1]);
        }

        if (includeDiagonals) {
            if (x > 0 && y > 0) {
                neighbors.push(this.data[x - 1][y - 1]);
            }

            if (x < this.width - 1 && y > 0) {
                neighbors.push(this.data[x + 1][y - 1]);
            }

            if (x > 0 && y < this.height - 1) {
                neighbors.push(this.data[x - 1][y + 1]);
            }

            if (x < this.width - 1 && y < this.height - 1) {
                neighbors.push(this.data[x + 1][y + 1]);
            }
        }

        return neighbors;
    }

    draw() {
        const mapSize = Math.min(canvas.width, canvas.height);
        const pixelSize = mapSize / Math.max(this.width, this.height);

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const cell = this.data[x][y];

                ctx.save();
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.strokeStyle = ctx.fillStyle = cell.cellType?.color ?? "#FFFFFF";
                ctx.rect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
        }
    }
}

// Expose for debugging
window.Rarity = Rarity;
window.CellType = CellType;
window.MobType = MobType;
window.MapCell = MapCell;
window.FloofMap = FloofMap;

// const map = FloofMap.fromImage(await loadImage("./maps/C.png"));
// map.draw();