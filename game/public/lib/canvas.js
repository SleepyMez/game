import * as util from "./util.js";

export const canvas = document.querySelector("canvas");
export const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;

    ctx.lineCap = ctx.lineJoin = "round";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
}

window.addEventListener("resize", resize);
resize();

export function uiScale() {
    if (canvas.height > canvas.width) {
        return canvas.height / 1080;
    }

    return canvas.width / 1920;
}

export function gameScale(fov) {
    const width = canvas.width / fov;
    const height = canvas.height / fov / 1080 * 1920;

    return Math.max(width, height);
}

const colorCache = new Map();
export function mixColors(primary, secondary, amount = .5) {
    const key = `${primary}${secondary}${amount}`;

    if (colorCache.has(key)) {
        return colorCache.get(key);
    }

    const pr = parseInt(primary.slice(1), 16);
    const sc = parseInt(secondary.slice(1), 16);

    const hex = `#${(
        1 << 24 |
        (util.lerp((pr >> 16) & 255, (sc >> 16) & 255, amount) | 0) << 16 |
        (util.lerp((pr >> 8) & 255, (sc >> 8) & 255, amount) | 0) << 8 |
        (util.lerp(pr & 255, sc & 255, amount) | 0)
    ).toString(16).slice(1)}`;

    colorCache.set(key, hex);

    return hex;
}

export function text(text, x, y, size, fill = "#FFFFFF", _ctx = ctx) {
    _ctx.fillStyle = fill;
    _ctx.strokeStyle = mixColors(fill, "#000000", .3);
    _ctx.lineWidth = size * .15;
    _ctx.font = `bold ${size}px sans-serif`;

    _ctx.strokeText(text, x, y);
    _ctx.fillText(text, x, y);

    return _ctx.measureText(text).width;
}

export function setStyle(main, lineWidth = .1, strength = .2) {
    ctx.fillStyle = main;
    ctx.strokeStyle = mixColors(main, "#000000", strength);
    ctx.lineWidth = lineWidth;
}

export function roundedRectangle(centerX, centerY, width, height, radius) {
    ctx.beginPath();
    ctx.roundRect(centerX - width / 2, centerY - height / 2, width, height, radius);
}

export function setColor(color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = mixColors(color, "#000000", .2);
}

export function drawBar(x1, x2, y, thickness, color = "#555555") {
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;

    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.closePath();
    ctx.stroke();
}

const tileImageCache = new Map();

function getTile(name) {
    if (tileImageCache.has(name)) {
        return tileImageCache.get(name);
    }

    const img = new Image();
    img.src = `./assets/${name}`;
    img.onload = () => {
        img.ready = true;
    }

    tileImageCache.set(name, img);

    return img;
}

export function drawBackground(camX, camY, scale, doBorder = false, mapWidth, mapHeight, biomeInfo, isRadial = false) {
    ctx.fillStyle = biomeInfo === null ? "rgba(200, 119, 85, 1)" : biomeInfo.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (util.options.useTileBackground && biomeInfo !== null && biomeInfo.tile) {
        const tile = getTile(biomeInfo.tile);

        if (tile.ready) {
            const tileWidth = tile.width * scale;
            const tileHeight = tile.height * scale;

            for (let i = (-camX % tileWidth) - tileWidth; i < canvas.width; i += tileWidth) {
                for (let j = (-camY % tileHeight) - tileHeight; j < canvas.height; j += tileHeight) {
                    ctx.drawImage(tile, i - 1, j - 1, tileWidth + 2, tileHeight + 2);
                }
            }
        }
    }

    if (doBorder) {
        const mWidth = mapWidth * scale;
        const mHeight = mapHeight * scale;
        ctx.fillStyle = "rgba(0, 0, 0, .3)";
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        if (isRadial) {
            ctx.arc(canvas.width * .5 - camX, canvas.height * .5 - camY, mWidth * .5, 0, Math.PI * 2);
        } else {
            ctx.rect(
                canvas.width * .5 - camX - mWidth * .5,
                canvas.height * .5 - camY - mHeight * .5,
                mWidth,
                mHeight
            );
        }
        ctx.fill("evenodd");
    }

    if (!util.options.hideGrid && !util.options.useTileBackground) {
        const gridSize = 32 * scale;

        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = .075;
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1.15 * scale;

        for (let x = (canvas.width * .5 - camX) % gridSize; x <= canvas.width; x += gridSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
        }
        for (let y = (canvas.height * .5 - camY) % gridSize; y <= canvas.height; y += gridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }

        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
}

export function drawBackgroundOverlay(camX, camY, scale, biomeInfo) {
    if (biomeInfo !== null && biomeInfo.alt) {
        ctx.globalAlpha = .2;

        const tile = getTile(biomeInfo.alt);
        const offsetX = performance.now() / 750;
        const offsetY = Math.sin(offsetX) * 4;

        const xx = camX + offsetX * scale;
        const yy = camY + offsetY * scale;

        if (tile.ready) {
            const tileWidth = tile.width * scale;
            const tileHeight = tile.height * scale;

            for (let i = (-xx % tileWidth) - tileWidth; i < canvas.width; i += tileWidth) {
                for (let j = (-yy % tileHeight) - tileHeight; j < canvas.height; j += tileHeight) {
                    ctx.drawImage(tile, i, j, tileWidth, tileHeight);
                }
            }
        }

        ctx.globalAlpha = 1;
    }
}

const TAU = Math.PI * 2;
const PI10 = -Math.PI / 10;
const PI10_2 = PI10 + Math.PI / 2;
const diam = .334 - .15;
export function drawNormalEye(x, y, lookAngle, mood, expression, isLeft = true) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();

    switch (expression) {
        case 1:
            ctx.ellipse(0, 0, .334, .667, 0, 0, TAU);
            break;
        case 2:
            if (isLeft) {
                ctx.ellipse(0, 0, .334, .667, 0, PI10, PI10 - (PI10_2) * (mood / 2));
            } else {
                ctx.ellipse(0, 0, .334, .667, 0, PI10 - (PI10_2) * (mood / 2), Math.PI - PI10);
            }
            break;
        case 3:
            ctx.ellipse(0, 0, .334, .667, 0, 0, TAU);
            break;
    }

    ctx.closePath();
    ctx.fillStyle = "#04190E";
    ctx.strokeStyle = "#04190E";
    ctx.lineWidth = .075;
    ctx.stroke();
    ctx.fill();
    ctx.clip();

    ctx.beginPath();
    ctx.arc(Math.cos(lookAngle) * diam, Math.sin(lookAngle) * diam * 2.15, .3, 0, TAU);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.closePath();

    ctx.restore();
}

export function drawDeadEye(x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(-.4, -.4);
    ctx.lineTo(.4, .4);
    ctx.moveTo(.4, -.4);
    ctx.lineTo(-.4, .4);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = .2;
    ctx.stroke();
    ctx.restore();
}

export function drawNormalMouth(mouthDip) {
    ctx.beginPath();
    ctx.moveTo(-.75, 1.16);
    ctx.quadraticCurveTo(0, mouthDip, .75, 1.16);
    ctx.strokeStyle = "#04190E";
    ctx.lineWidth = .2;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.closePath();
}

export function drawFace(size, lookAngle, mood, mouthDip, expression, dead = false) {
    ctx.scale(size, size);
    if (dead) {
        drawDeadEye(-.75, -.5);
        drawDeadEye(.75, -.5);
    } else {
        drawNormalEye(-.75, -.5, lookAngle, mood, expression);
        drawNormalEye(.75, -.5, lookAngle, mood, expression, false);
    }
    drawNormalMouth(mouthDip);
    ctx.scale(1 / size, 1 / size);
}

export function drawWrappedText(text, x, y, size, maxWidth, fill = "#FFFFFF", _ctx = ctx, wrapTo = x) {
    _ctx.font = `bold ${size}px sans-serif`;

    _ctx.strokeStyle = mixColors(fill, "#000000", 0.3);
    _ctx.lineWidth = size * 0.2;
    _ctx.fillStyle = fill;

    const lines = [];
    const words = text.split(" ");

    // Handle single-word case early
    if (words.length === 1) {
        _ctx.strokeText(text, x, y);
        _ctx.fillText(text, x, y);
        return _ctx.measureText(text).width;
    }

    let line = "";
    for (let i = 0; i < words.length; i++) {
        // Handle words that are too long to fit in maxWidth by splitting them
        while (_ctx.measureText(words[i]).width > maxWidth) {
            const oldWord = words[i];
            const newWords = [];
            let wordSegment = "";

            for (let j = 0; j < oldWord.length; j++) {
                const testSegment = wordSegment + oldWord[j];
                if (_ctx.measureText(testSegment).width > maxWidth) {
                    newWords.push(wordSegment);
                    wordSegment = "";
                }
                wordSegment += oldWord[j];
            }
            newWords.push(wordSegment); // Push last remaining segment

            // Replace the current word with the new segments
            words.splice(i, 1, ...newWords);

            // If the word was split into one piece, stop splitting
            if (newWords.length === 1) break;
        }

        const testLine = line + words[i] + " ";
        const testWidth = _ctx.measureText(testLine).width;

        if (testWidth > maxWidth && line) {
            lines.push(line.trim());
            line = words[i] + " ";
        } else {
            line = testLine;
        }
    }

    // Push the final line
    lines.push(line.trim());

    // Render each line with wrapping applied
    for (let i = 0; i < lines.length; i++) {
        const lineY = y + size * i;
        const lineX = i > 0 ? wrapTo : x;

        _ctx.strokeText(lines[i], lineX, lineY);
        _ctx.fillText(lines[i], lineX, lineY);
    }

    // Return the height used for text rendering
    return _ctx.measureText("M").width * lines.length;
}

const wallBrown = [
    "#4f5b5e", // default
    "#68472E", // garden
    "#ab9476", // desert
    "#68472E", // ocean
    "#68472E", // ant hell
    "#682A24", // hell
    "#68472E", // sewers
    "#68472E", // dark forest
    "#353535" // halloween
];
const wallDark = [
    "#414d4f", // default
    "#4F3422", // garden
    "#806e58", // desert
    "#4F3422", // ocean
    "#4F3422", // ant hell
    "#4E1F1B", // hell
    "#4F3422", // sewers
    "#4F3422", // dark forest
    "#252525" // halloween
];
const tileSize = 96;

function createTile(biomeInfo) {
    const tile = document.createElement("canvas");
    tile.width = tileSize;
    tile.height = tileSize;

    const tileCtx = tile.getContext("2d");
    tileCtx.imageSmoothingEnabled = true;
    tileCtx.imageSmoothingQuality = "high";

    tileCtx.fillStyle = wallBrown[biomeInfo];
    tileCtx.fillRect(0, 0, tileSize, tileSize);

    tileCtx.fillStyle = wallDark[biomeInfo];

    const poses = [];

    for (let i = 0, n = 5 + Math.random() * 8 | 0; i < n; i++) {
        let z = 0;
        while (++z < 128) {
            const size = 4 + Math.random() * 4;
            const x = size + Math.random() * (tileSize - size * 2);
            const y = size + Math.random() * (tileSize - size * 2);

            if (poses.some(p => Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2) < p.size + size + 4)) {
                continue;
            }

            tileCtx.beginPath();
            tileCtx.arc(x, y, size, 0, Math.PI * 2);
            tileCtx.fill();
            poses.push({ x, y, size });
            break;
        }
    }

    return tile;
}

function createTiles(nX, nY, biomeInfo) {
    const tile = document.createElement("canvas");
    tile.width = tileSize * nX;
    tile.height = tileSize * nY;

    const tileCtx = tile.getContext("2d");
    tileCtx.imageSmoothingEnabled = true;
    tileCtx.imageSmoothingQuality = "high";

    for (let y = 0; y < nY; y++) {
        for (let x = 0; x < nX; x++) {
            tileCtx.drawImage(createTile(biomeInfo), x * tileSize, y * tileSize);
        }
    }

    return tile;
}

export function renderTerrain(mapWidth, mapHeight, gridWidth, blocks, biomeInfo) {
    const img = document.createElement("canvas");
    const imgCtx = img.getContext("2d");

    img.width = mapWidth;
    img.height = mapHeight;

    imgCtx.imageSmoothingEnabled = true;
    imgCtx.imageSmoothingQuality = "high";
    imgCtx.lineCap = imgCtx.lineJoin = "round";

    const size = mapWidth / gridWidth / 2;

    imgCtx.beginPath();
    for (const block of blocks) {
        const x = 2 * (block.x + .5) * size;
        const y = 2 * (block.y + .5) * size;
        const points = block.terrain;

        imgCtx.moveTo(x + points[0].x * size, y + points[0].y * size);

        for (let i = 1; i < points.length; i++) {
            imgCtx.lineTo(x + points[i].x * size, y + points[i].y * size);
        }

        imgCtx.lineTo(x + points[0].x * size, y + points[0].y * size);
    }

    imgCtx.strokeStyle = "rgba(0, 0, 0, .3)";
    imgCtx.lineWidth = size * .2;
    imgCtx.stroke();

    // imgCtx.fillStyle = mixColors(util.colors.scorpionBrown, util.colors.spider, .25);
    const pattern = imgCtx.createPattern(createTiles(4, 4, biomeInfo), "repeat");
    imgCtx.fillStyle = pattern;
    imgCtx.strokeStyle = wallDark;
    imgCtx.lineWidth = size * .1;
    imgCtx.stroke();
    imgCtx.fill();

    return img;
}

export function renderTerrainForMap(gridWidth, blocks) {
    const img = document.createElement("canvas");
    const imgCtx = img.getContext("2d");

    img.width = 512;
    img.height = 512;

    imgCtx.imageSmoothingEnabled = true;
    imgCtx.imageSmoothingQuality = "high";
    imgCtx.lineCap = imgCtx.lineJoin = "round";

    const size = 512 / gridWidth / 2;

    imgCtx.fillStyle = "#FFFFFF";
    imgCtx.fillRect(0, 0, 512, 512);

    imgCtx.fillStyle = "#000000";

    imgCtx.beginPath();
    for (const block of blocks) {
        const x = 2 * (block.x + .5) * size;
        const y = 2 * (block.y + .5) * size;
        imgCtx.rect(x - size, y - size, size * 2, size * 2);
    }

    imgCtx.fill();

    return img;
}

// export function spookyOverlay(camX, camY, scale, mapWidth, mapHeight, terrainWidth) {

// }

export class SpookyOverlay {
    constructor(blocks, gridWidth, gridHeight) {
        this.grid = new Array(gridWidth).fill(0).map(() => new Array(gridHeight).fill(0));

        for (let i = 0; i < blocks.length; i++) {
            const b = blocks[i];

            this.grid[b.x][b.y] = 1;
        }

        this.lifetimes = [];

        this.canvas = new OffscreenCanvas(canvas.width, canvas.height);
        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = true;

        window.addEventListener("resize", () => {
            this.canvas.width = window.innerWidth * window.devicePixelRatio;
            this.canvas.height = window.innerHeight * window.devicePixelRatio;
        });

        this.cellsNeeded = [];
        this.lastX = 0;
        this.lastY = 0;
    }

    update() {
        for (let i = 0; i < this.cellsNeeded.length; i++) {
            if (this.cellsNeeded[i].active) {
                this.cellsNeeded[i].life = Math.min(120, this.cellsNeeded[i].life + 1);
            } else {
                this.cellsNeeded[i].life--;

                if (this.cellsNeeded[i].life <= 0) {
                    this.cellsNeeded.splice(i, 1);
                    i--;
                }
            }
        }
    }

    figureOutnextOnes(maxDepth) {
        const newCells = new Set();

        const neighbors = (x, y, d = 0) => {
            if (d > maxDepth) {
                return;
            }

            newCells.add(`${x},${y}`);

            if (this.grid[x][y] === 0) {
                if (x > 0) {
                    neighbors(x - 1, y, d + 1);
                }

                if (y > 0) {
                    neighbors(x, y - 1, d + 1);
                }

                if (x < this.grid.length - 1) {
                    neighbors(x + 1, y, d + 1);
                }

                if (y < this.grid[0].length - 1) {
                    neighbors(x, y + 1, d + 1);
                }
            }
        }

        neighbors(this.lastX, this.lastY);

        for (const cell of newCells) {
            const [x, y] = cell.split(",").map(Number);

            let i = this.cellsNeeded.findIndex(c => c.x === x && c.y === y);

            if (i === -1) {
                this.cellsNeeded.push({ x, y, life: 0, active: true });
                continue;
            }

            this.cellsNeeded[i].active = true;
        }

        for (let i = 0; i < this.cellsNeeded.length; i++) {
            const cell = this.cellsNeeded[i];

            if (!newCells.has(`${cell.x},${cell.y}`)) {
                cell.active = false;
            }
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx, cameraX, cameraY, lightBoost = 0, mapWidth, mapHeight, scale, hw, hh) {
        const blockX = (cameraX + mapWidth / 2) / mapWidth * this.grid.length | 0;
        const blockY = (cameraY + mapHeight / 2) / mapHeight * this.grid.length | 0;

        if (this.lastX !== blockX || this.lastY !== blockY) {
            this.lastX = blockX;
            this.lastY = blockY;

            this.figureOutnextOnes(2 + lightBoost);
        }

        this.update();

        // Save the context state
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.ctx.save();

        // Fill the entire canvas with black
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Cut out the path area (making it transparent)
        this.ctx.globalCompositeOperation = "destination-out";
        this.ctx.beginPath();
        for (let i = 0; i < this.cellsNeeded.length; i++) {
            const x = this.cellsNeeded[i].x;
            const y = this.cellsNeeded[i].y;

            let dx = x / this.grid.length * mapWidth - cameraX + hw - mapHeight / 2,
                dy = y / this.grid.length * mapHeight - cameraY + hh - mapHeight / 2;

            this.ctx.fillRect(dx - 1, dy - 1, 1 + mapWidth / this.grid.length, 1 + mapHeight / this.grid.length);
        }

        this.ctx.fill();
        this.ctx.restore();

        // Freaky
        this.ctx.save();
        this.ctx.fillStyle = "#000000";

        for (let i = 0; i < this.cellsNeeded.length; i++) {
            if (this.cellsNeeded[i].life <= 120) {
                this.ctx.globalAlpha = 1 - this.cellsNeeded[i].life / 120;

                const x = this.cellsNeeded[i].x;
                const y = this.cellsNeeded[i].y;

                let dx = x / this.grid.length * mapWidth - cameraX + hw - mapHeight / 2,
                    dy = y / this.grid.length * mapHeight - cameraY + hh - mapHeight / 2;

                this.ctx.fillRect(dx - 1, dy - 1, 1 + mapWidth / this.grid.length, 1 + mapHeight / this.grid.length);
            }
        }

        // Restore the context state
        this.ctx.restore();

        // Draw the overlay on the main canvas
        ctx.drawImage(this.canvas, 0, 0);
    }
}