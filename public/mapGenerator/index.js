import { brush, brushWidth, map } from "./lib/state.js";

export * from "./lib/ui.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();

let mouseDown = false;

window.addEventListener("mousemove", e => {
    if (!mouseDown) {
        return;
    }

    drawOn(e);
});

window.addEventListener("mousedown", e => {
    if (e.target !== canvas) {
        return;
    }

    mouseDown = true;
    drawOn(e); 
});

window.addEventListener("mouseup", () => {
    mouseDown = false;
});

function drawOn(e) {
    const size = Math.min(canvas.width, canvas.height);
    const sizeCells = Math.max(map.width, map.height);

    const x = Math.floor(e.clientX / size * map.width / (map.width / sizeCells));
    const y = Math.floor(e.clientY / size * map.height / (map.height / sizeCells));

    if (x < 0 || y < 0 || x >= map.width || y >= map.height) {
        return;
    }

    if (brushWidth > 1) {
        let minX = Math.max(0, x - brushWidth / 2) | 0,
            minY = Math.max(0, y - brushWidth / 2) | 0;

        if (brushWidth % 2) {
            minX ++;
            minY ++;
        }

        let maxX = Math.min(map.width, minX + brushWidth) | 0,
            maxY = Math.min(map.height, minY + brushWidth) | 0;

        for (let xx = minX; xx < maxX; xx++) {
            for (let yy = minY; yy < maxY; yy++) {
                map.set(xx, yy, brush.id);
            }
        }
    } else {
        map.set(x, y, brush.id);
    }
}

function render() {
    requestAnimationFrame(render);

    map.draw(canvas, ctx);
}

window.addEventListener("load", render);

window.map = map;