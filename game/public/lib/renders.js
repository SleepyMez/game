import { state } from "./net.js";
import { ctx as _ctx, drawWrappedText, mixColors, roundedRectangle, text } from "./canvas.js";
import { formatLargeNumber, colors } from "./util.js";
import { Drawing, PetalConfig } from "./protocol.js";

const TAU = Math.PI * 2;

function setStyle(c, main, lineWidth = .1) {
    c.fillStyle = main;
    c.strokeStyle = mixColors(main, "#000000", .2);
    c.lineWidth = lineWidth;
}

function dipPolygon(ctx, sides, r, dipMult) {
    const dip = 1 - (7 / sides / sides) * dipMult;

    ctx.beginPath();

    ctx.moveTo(r, 0);

    for (let i = 0; i < sides; i++) {
        const theta = (i + 1) / sides * TAU;
        const hTheta = (i + .5) / sides * TAU;

        ctx.quadraticCurveTo(
            Math.cos(hTheta) * dip * r,
            Math.sin(hTheta) * dip * r,
            Math.cos(theta) * r,
            Math.sin(theta) * r
        );
    }

    ctx.closePath();
}

function polygon(ctx, sides, r, R) {
    ctx.beginPath();

    const tTheta = TAU / sides;
    for (let i = 0; i < sides; i++) {
        const theta = i * tTheta;

        ctx.lineTo(Math.cos(theta + R) * r, Math.sin(theta + R) * r);
    }

    ctx.closePath();
}

function spikeBall(ctx, sides, r, R) {
    ctx.beginPath();

    const tTheta = TAU / sides;
    for (let i = 0; i < sides; i++) {
        const theta = i * tTheta;

        ctx.lineTo(Math.cos(theta + R) * r, Math.sin(theta + R) * r);
        ctx.lineTo(Math.cos(theta + R + tTheta / 2) * r * .5, Math.sin(theta + R + tTheta / 2) * r * .5);
    }

    ctx.closePath();
}

function scorpionPincer(ctx) {
    ctx.beginPath();
    ctx.lineTo(0, 0);
    ctx.quadraticCurveTo(.7, -.16, .64, -.22);
    ctx.quadraticCurveTo(.64, -.35, -.03, -.2);
    ctx.closePath();
    ctx.fill();
}

function basicPetal(ctx = _ctx, hit = false, col = colors.white) {
    setStyle(ctx, mixColors(col, "#FF0000", hit * .5), .225);
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.fill();
    ctx.stroke();
}

const lightCount = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 7, 7];
function drawLight(rarity, ctx = _ctx, hit = false) {
    const count = lightCount[rarity];
    setStyle(ctx, mixColors(colors.white, "#FF0000", hit * .5), count > 1 ? .15 : .2);

    if (count > 1) {
        for (let i = count; i > 0; i--) {
            const angle = TAU / count * i;

            ctx.beginPath();
            ctx.arc(Math.cos(angle) * .67, Math.sin(angle) * .67, .5, 0, TAU);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
    } else {
        ctx.beginPath();
        ctx.arc(0, 0, .5, 0, TAU);
        ctx.fill();
        ctx.stroke();
    }
}

function drawStinger(rarity, ctx = _ctx) {
    const count = lightCount[rarity];
    setStyle(ctx, colors.stingerBlack, count > 0 ? .1 : .2);

    if (count > 1) {
        for (let i = count; i > 0; i--) {
            const angle = TAU / count * i;
            const x = Math.cos(angle) * .6;
            const y = Math.sin(angle) * .6;

            ctx.translate(x, y);
            polygon(ctx, 3, .5, angle);
            ctx.fill();
            ctx.stroke();

            ctx.translate(-x, -y);
        }
    } else {
        polygon(ctx, 3, .5, 0);
        ctx.fill();
        ctx.stroke();
    }
}

function trianglePetal(ctx = _ctx, hit = false, col = colors.white) {
    setStyle(ctx, mixColors(col, "#FF0000", hit * .5), .2);
    ctx.beginPath();
    polygon(ctx, 3, 1, 0);
    ctx.fill();
    ctx.stroke();
}

function drawHeavy(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.stingerBlack, "#FF0000", hit * .5), .2);
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = colors.white;
    ctx.beginPath();
    ctx.arc(.25, -.25, .25, 0, TAU);
    ctx.closePath();
    ctx.fill();
}

const ricePath = new Path2D("M.64.35C.71.57.57.71.35.64Q0 0-.64-.35C-.71-.57-.57-.71-.35-.64Q.35-.35.64.35");
function drawRice(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.white, "#FF0000", hit * .5), .2);
    ctx.fill(ricePath);
    ctx.stroke(ricePath);
}

function drawRockP(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.rockGray, "#FF0000", hit * .5), .2);
    polygon(ctx, 5, 1, 0);
    ctx.fill();
    ctx.stroke();
}

function drawCactusPetal(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.cactusGreen, "#FF0000", hit * .5), .125);
    dipPolygon(ctx, 8, 1, 2.5);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = mixColors(colors.cactusLightGreen, "#FF0000", hit * .5);
    ctx.beginPath();
    ctx.arc(0, 0, .6, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawLeaf(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.leafGreen, "#FF0000", hit * .5), .15);
    ctx.beginPath();
    ctx.moveTo(-.6609, .4525);
    ctx.quadraticCurveTo(-.2989, .6336, .1536, .5431);
    ctx.quadraticCurveTo(.5157, .4525, .7872, .2715);
    ctx.quadraticCurveTo(1.104, .0453, .8777, -.181);
    ctx.quadraticCurveTo(.6062, -.4525, .1536, -.5431);
    ctx.quadraticCurveTo(-.2989, -.6336, -.7062, -.4073);
    ctx.quadraticCurveTo(-1.2493, .0453, -.6609, .4525);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(.6, 0);
    ctx.quadraticCurveTo(0, .1, -.6, 0);
    ctx.moveTo(-1, 0);
    ctx.quadraticCurveTo(-1.3, -.05, -1.35, -.1);
    ctx.stroke();
    ctx.closePath();
}

function drawWing(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.white, "#FF0000", hit * .5), .2);
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI);
    ctx.quadraticCurveTo(0, .85, 1, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

const bonePath = new Path2D("M.9 0A.05.05 90 00.65-.3Q0-.03-.65-.3A.05.05 90 00-.9 0 .05.05 90 00-.65.3Q0 .03.65.3A.05.05 90 00.9 0");
function drawBone(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(mixColors(colors.white, colors.cumWhite, .5 + Math.sin(performance.now() / 100) * .5), "#FF0000", hit), .125);
    ctx.fill(bonePath);
    ctx.stroke(bonePath);
}

function drawDirt(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(mixColors(colors.scorpionBrown, colors.spider, .25), "#FF0000", .75 * hit), .3);

    dipPolygon(ctx, 7, 1, 1.5);
    ctx.fill();
    ctx.stroke();
}

function drawMagnolia(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.ladybugRed, "#FF0000", .75 * hit), .2);
    dipPolygon(ctx, 9, 1.1, 4);
    ctx.fill();
    ctx.stroke();

    setStyle(ctx, mixColors(ctx.fillStyle, mixColors(colors.white, "#FF0000", .75 * hit), .2), .2);
    ctx.beginPath();
    ctx.arc(0, 0, .75, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawCorn(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.beeYellow, "#FF0000", .75 * hit), .2);
    ctx.beginPath();
    ctx.moveTo(.85, .85);
    ctx.quadraticCurveTo(1.3, 0, .85, -.85);
    ctx.bezierCurveTo(.55, -1.3, -.05, -.95, -.9, -.65);
    ctx.quadraticCurveTo(0, 0, -.9, .65);
    ctx.bezierCurveTo(-.05, .95, .55, 1.3, .85, .85);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawSingleSand(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.sand, "#FF0000", hit * .5), .4);

    polygon(ctx, 6, 1, 0);
    ctx.fill();
    ctx.stroke();
}

function drawSands(ctx = _ctx) {
    setStyle(ctx, colors.sand, .2);
    ctx.scale(1.05, 1.05)

    for (let i = 0; i < 4; i++) {
        const angle = TAU / 4 * i;

        ctx.save();
        ctx.translate(Math.cos(angle) * .7, Math.sin(angle) * .7);
        polygon(ctx, 6, .5, angle + Math.PI / 4);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}

function drawOrange(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.orange, "#FF0000", hit * .5), .2);

    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    setStyle(ctx, mixColors(colors.leafGreen, "#FF0000", hit * .5), .2);

    ctx.translate(0, .5)
    ctx.beginPath();
    ctx.moveTo(0, -1);
    ctx.quadraticCurveTo(.7, -1.5, 1.4, -.9);
    ctx.quadraticCurveTo(.6, -.5, 0, -1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawOranges(ctx = _ctx) {
    ctx.scale(1.3, 1.3)
    for (let i = 0; i < 3; i++) {
        const angle = TAU / 3 * i;

        ctx.save();
        ctx.translate(Math.cos(angle) * .5, Math.sin(angle) * .5);
        ctx.scale(.6, .6);
        ctx.rotate(Math.PI / 2 + angle)
        drawOrange(ctx, false);
        ctx.restore();
    }
}

function drawMissile(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.lighterBlack, "#FF0000", hit * .5), .2);

    ctx.beginPath();
    ctx.moveTo(1, 0);
    ctx.lineTo(-.9, -.667);
    ctx.lineTo(-.9, .667);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawWaspMissile(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.lighterBlack, "#FF0000", hit * .5), .2);

    ctx.beginPath();
    ctx.moveTo(1, 0);
    ctx.lineTo(-.9, -.775);
    ctx.lineTo(-.9, .775);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawYinYang(ctx = _ctx, hit = false) {
    const YINYANG_W = mixColors("#FFFFFF", "#FF0000", hit * .5);
    const YINYANG_WB = mixColors("#EAEAEA", "#FF0000", hit * .5);
    const YINYANG_B = mixColors("#333333", "#FF0000", hit * .5);
    const YINYANG_BB = mixColors("#303030", "#FF0000", hit * .5);

    ctx.lineWidth = .2;
    ctx.fillStyle = YINYANG_W;
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU, false);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = YINYANG_B;
    ctx.beginPath();
    ctx.arc(0, 0, 1, -Math.PI / 2, Math.PI / 2, false);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = YINYANG_B;
    ctx.beginPath();
    ctx.arc(0, .5, .5, 0, TAU, false);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = YINYANG_W;
    ctx.beginPath();
    ctx.arc(0, -.5, .5, 0, TAU, false);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = YINYANG_BB;
    ctx.beginPath();
    ctx.arc(0, 0, 1, -Math.PI / 2, 0, false);
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = YINYANG_WB;
    ctx.beginPath();
    ctx.arc(0, 0, 1, -Math.PI / 2, Math.PI / 2, true);
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = YINYANG_BB;
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI / 2, false);
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = YINYANG_BB;
    ctx.beginPath();
    ctx.arc(0, .5, .5, -Math.PI / 2, Math.PI / 2, true);
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = YINYANG_WB;
    ctx.beginPath();
    ctx.arc(0, -.5, .5, -Math.PI / 2, Math.PI / 2, false);
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = YINYANG_W;
    ctx.beginPath();
    ctx.arc(0, .5, .15, 0, TAU, false);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = YINYANG_B;
    ctx.beginPath();
    ctx.arc(0, -.5, .15, 0, TAU, false);
    ctx.closePath();
    ctx.fill();
}

const pollenCount = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5];
function drawPollenIcon(rarity, ctx = _ctx) {
    const count = pollenCount[rarity];
    setStyle(ctx, colors.pollenGold, count > 0 ? .1 : .2);

    if (count > 1) {
        for (let i = count; i > 0; i--) {
            const angle = TAU / count * i;

            ctx.beginPath();
            ctx.arc(Math.cos(angle) * .6, Math.sin(angle) * .6, .5, 0, TAU);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
    } else {
        ctx.beginPath();
        ctx.arc(0, 0, .5, 0, TAU);
        ctx.fill();
        ctx.stroke();
    }
}

function drawHoney(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.honeyGold, "#FF0000", hit * .5), .225);
    polygon(ctx, 6, 1, 0);
    ctx.fill();
    ctx.stroke();
}

function drawWebPetal(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.white, "#FF0000", hit * .5), .2);
    dipPolygon(ctx, 5, 1, 1.5);
    ctx.fill();
    ctx.stroke();
}

// function drawWebMob(ctx = _ctx, friend = false) {
//     setStyle(ctx, friend ? colors.cumWhite : colors.white, .1);
//     dipPolygon(ctx, 13, 1, 5);
//     ctx.stroke();
//     dipPolygon(ctx, 13, .8, 5);
//     ctx.stroke();
//     dipPolygon(ctx, 13, .6, 5);
//     ctx.stroke();
//     dipPolygon(ctx, 13, .4, 5);
//     ctx.stroke();

//     ctx.beginPath();
//     for (let i = 0; i < 13; i++) {
//         ctx.moveTo(0, 0);
//         ctx.lineTo(Math.cos(TAU / 13 * i) * 1.1, Math.sin(TAU / 13 * i) * 1.1);
//     }
//     ctx.stroke();
//     ctx.closePath();
// }

const drawWebMob = ((color) => {
    const canv = new OffscreenCanvas(512, 512);
    const ctx = canv.getContext("2d");

    ctx.scale(256, 256);
    ctx.translate(1, 1);
    ctx.scale(.875, .875);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    setStyle(ctx, colors.white, .1);
    dipPolygon(ctx, 13, 1, 5);
    ctx.stroke();
    dipPolygon(ctx, 13, .8, 5);
    ctx.stroke();
    dipPolygon(ctx, 13, .6, 5);
    ctx.stroke();
    dipPolygon(ctx, 13, .4, 5);
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i < 13; i++) {
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(TAU / 13 * i) * 1.1, Math.sin(TAU / 13 * i) * 1.1);
    }
    ctx.stroke();
    ctx.closePath();

    return ctx => {
        ctx.drawImage(canv, -1, -1, 2, 2);
    }
})();

const drawYellowWebMob = (() => {
    const canv = new OffscreenCanvas(512, 512);
    const ctx = canv.getContext("2d");

    ctx.scale(256, 256);
    ctx.translate(1, 1);
    ctx.scale(.875, .875);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    setStyle(ctx, mixColors(colors.playerYellow, "#ffffff", .25), .1);
    dipPolygon(ctx, 13, 1, 5);
    ctx.stroke();
    dipPolygon(ctx, 13, .8, 5);
    ctx.stroke();
    dipPolygon(ctx, 13, .6, 5);
    ctx.stroke();
    dipPolygon(ctx, 13, .4, 5);
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i < 13; i++) {
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(TAU / 13 * i) * 1.1, Math.sin(TAU / 13 * i) * 1.1);
    }
    ctx.stroke();
    ctx.closePath();

    return ctx => {
        ctx.drawImage(canv, -1, -1, 2, 2);
    }
})();

export function drawThirdEye(ctx = _ctx, hit = false) {
    ctx.fillStyle = mixColors(colors.lighterBlack, "#FF0000", hit * .5);
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = .1;
    ctx.beginPath();
    ctx.moveTo(0, -1);
    ctx.quadraticCurveTo(-1, 0, 0, 1);
    ctx.quadraticCurveTo(1, 0, 0, -1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = mixColors(colors.white, "#FF0000", hit * .5);
    ctx.beginPath();
    ctx.arc(0, 0, .5, 0, TAU);
    ctx.closePath();
    ctx.fill();
}

function drawPincer(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.lighterBlack, "#FF0000", hit * .5), .2);
    ctx.beginPath();
    ctx.moveTo(-1, -.2);
    ctx.quadraticCurveTo(-.2, -.95, .9, .2);
    ctx.lineTo(.9, .2);
    ctx.quadraticCurveTo(.2, -.1, -1, .2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawEgg(rarity, color, ctx = _ctx, hit = false) {
    const size = .9 + (rarity * .025);

    setStyle(ctx, mixColors(color, "#FF0000", hit * .5), .2);
    ctx.beginPath();
    ctx.ellipse(0, 0, size * .775, size, 0, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

export function drawAntennae(ctx = _ctx) {
    ctx.save();
    setStyle(ctx, colors.lighterBlack, .1);
    ctx.scale(1.5, 1.5);
    ctx.beginPath();
    ctx.moveTo(.16, 0);
    ctx.quadraticCurveTo(.18, -.51, .49, -.83);
    ctx.quadraticCurveTo(.3, -.41, .16, 0);
    ctx.moveTo(-.16, 0);
    ctx.quadraticCurveTo(-.18, -.51, -.49, -.83);
    ctx.quadraticCurveTo(-.3, -.41, -.16, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

function drawPeas(ctx = _ctx, hit = false, color) {
    setStyle(ctx, mixColors(color, "#FF0000", hit * .5), .2);
    for (let i = 0; i < 4; i++) {
        const angle = i * TAU / 4 + TAU / 8;
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * .75, Math.sin(angle) * .75, .75, 0, TAU);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}

function drawStick(color, ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(color, "#FF0000", hit * .5), .4);

    ctx.beginPath();
    ctx.moveTo(-1, 0);
    ctx.lineTo(1, 0);
    ctx.moveTo(-.6, -.6);
    ctx.lineTo(-.75, .4);
    ctx.moveTo(.6, -.4);
    ctx.lineTo(.8, .8);
    ctx.stroke();
    ctx.closePath();
}

function drawScorpionProjectile(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.lighterBlack, "#FF0000", hit * .5), .2);

    ctx.beginPath();
    ctx.moveTo(1, 0);
    ctx.lineTo(-.85, -1.15);
    ctx.lineTo(-.85, 1.15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawDahlia(ctx = _ctx) {
    setStyle(ctx, colors.rosePink, .2);

    for (let i = 0; i < 3; i++) {
        const angle = TAU / 3 * i + TAU / 12;

        ctx.beginPath();
        ctx.arc(Math.cos(angle) * .66, Math.sin(angle) * .66, .5, 0, TAU);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}

function drawPrimrose(ctx = _ctx, hit = false, real = false) {
    if (real) {
        ctx.shadowColor = "#FFFFFF";
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.arc(0, 0, 1, 0, TAU);
        ctx.closePath();
        ctx.fill();
    }

    setStyle(ctx, mixColors(colors.honeyGold, "#FF0000", hit * .5), .15);

    ctx.rotate(Math.PI / 6);
    dipPolygon(ctx, 3, 1.2, .1);
    ctx.rotate(-Math.PI / 6);
    ctx.fill();
    ctx.stroke();

    dipPolygon(ctx, 3, .8, .1);
    ctx.fill();
    ctx.stroke();

    setStyle(ctx, mixColors(colors.rosePink, "#FF0000", hit * .5), .075);
    for (let i = 0; i < 3; i++) {
        const angle = TAU / 3 * i + TAU / 6;

        ctx.beginPath();
        ctx.arc(Math.cos(angle) * .3, Math.sin(angle) * .3, .12, 0, TAU);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}

function drawSpellbook(ctx = _ctx, hit = false, real = false, spell = 0) {
    if (real) {
        ctx.shadowColor = "#C85555";
        ctx.shadowBlur = 10 + Math.sin(performance.now() / 300) * 5;

        ctx.beginPath();
        ctx.arc(0, 0, 1, 0, TAU);
        ctx.closePath();
        ctx.fill();
    }

    ctx.shadowBlur = 0;

    setStyle(ctx, mixColors(colors.book, "#FF0000", hit * .5), .15);
    ctx.beginPath();
    ctx.rect(-1, -1, 2, 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = mixColors(mixColors(colors.bookSpine, "#000000", .2), "#FF0000", hit * .5);
    ctx.lineWidth = .2;
    ctx.beginPath();
    ctx.moveTo(-1, -1);
    ctx.lineTo(-1, 1);
    ctx.stroke();

    switch (spell) {
        case 0: // Pentagram
            setStyle(ctx, mixColors(colors.evilLadybugRed, "#FF0000", hit * .5), .1);
            polygon(ctx, 5, .35, 0);
            ctx.fill();
            ctx.stroke();
            break;
        case 1: // Earth
            setStyle(ctx, mixColors(colors.rockGray, "#FF0000", hit * .5), .1);
            polygon(ctx, 6, .35, 0);
            ctx.fill();
            ctx.stroke();
            break;
    }
}

const spikeSize = TAU / 12;
function drawDeity(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.lightningTeal, "#FF0000", hit * .5), .125);

    ctx.beginPath();

    for (let i = 0; i < 3; i++) {
        const angle = i * TAU / 3;
        const m = angle - spikeSize;
        const M = angle + spikeSize;
        const a3 = angle + Math.PI / 3;
        const A3 = angle + Math.PI / 3 * 2;

        ctx.lineTo(Math.cos(m) * .75, Math.sin(m) * .75);
        ctx.lineTo(Math.cos(angle), Math.sin(angle));
        ctx.bezierCurveTo(Math.cos(M) * .75, Math.sin(M) * .75, Math.cos(a3) * .5, Math.sin(a3) * .5, Math.cos(A3) * .5, Math.sin(A3) * .5);
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawLightning(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.lightningTeal, "#FF0000", hit * .5), .125);
    spikeBall(ctx, 10, 1, 0);
    ctx.fill();
    ctx.stroke();
}

function drawPowderStatic(ctx = _ctx) {
    ctx.fillStyle = colors.white;

    for (let i = 0; i < 8; i++) {
        const angle = TAU / 8 * i;

        const d = i % 3 === 0 ? .5 : .25;

        ctx.beginPath();
        ctx.arc(Math.cos(angle) * d, Math.sin(angle) * d, .3, 0, TAU);
        ctx.closePath();
        ctx.fill();
    }
}

function drawPowderDynamic(id, ctx = _ctx, hit = false) {
    ctx.fillStyle = mixColors(colors.white, "#FF0000", hit * .5);

    for (let i = 0; i < 8; i++) {
        const angle = TAU / 8 * i + Math.cos(performance.now() * .005 - id) + id * 4 + i * .05;

        const d = (i % 3 === 0 ? .6 : .4) * (Math.sin(performance.now() * .005 + id * 3 + i * .2) * .5 + .6);

        ctx.beginPath();
        ctx.arc(Math.cos(angle) * d, Math.sin(angle) * d, .5 * (Math.cos(performance.now() * .005 + id * 5 + i * .2) * .3 + 1), 0, TAU);
        ctx.closePath();
        ctx.fill();
    }
}

function drawAntEgg(ctx = _ctx) {
    setStyle(ctx, colors.peach, .2);

    for (let i = 0; i < 4; i++) {
        const angle = i * TAU / 4;
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * .6, Math.sin(angle) * .6, .75, 0, TAU);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}

function drawYucca(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.peaGreen, "#FF0000", hit * .5), .225);
    ctx.beginPath();
    ctx.moveTo(1.1, 0);
    ctx.bezierCurveTo(.5, -.9, -.5, -.7, -1.1, 0);
    ctx.bezierCurveTo(-.9, .9, .5, .7, 1.1, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(1, 0);
    ctx.quadraticCurveTo(.4, -.4, -1, 0);
    ctx.stroke();
}

const magnetPath = new Path2D("M-.03 0-.36-0Q-.4-.21-.2-.4-.01-.56.45-.43A.04.04-88.1 01.33-.11Q.18-.17.05-.15-.05-.13-.03 0Z");
const magnet2Path = new Path2D("M-.03 0-.36 0Q-.4.21-.2.4-.01.56.45.43A.04.04 90 00.33.11Q.18.17.05.15-.05.13-.03 0Z");

function drawMagnet(ctx = _ctx, hit = false) {
    ctx.save();
    ctx.scale(2, 2);
    setStyle(ctx, mixColors("#4343A4", "#FF0000", hit * .5), .15);
    ctx.fill(magnetPath);
    ctx.stroke(magnetPath);
    setStyle(ctx, mixColors("#A44343", "#FF0000", hit * .5), .15);
    ctx.fill(magnet2Path);
    ctx.stroke(magnet2Path);
    ctx.restore();
}

export function drawAmulet(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.sandGold, "#FF0000", hit * .5), .15);

    ctx.beginPath();

    for (let i = 0; i < 3; i++) {
        const angle = i * TAU / 3;
        const m = angle - spikeSize;
        const M = angle + spikeSize;
        const a3 = angle + Math.PI / 3;
        const A3 = angle + Math.PI / 3 * 2;

        ctx.lineTo(Math.cos(m), Math.sin(m));
        ctx.lineTo(Math.cos(angle), Math.sin(angle));
        ctx.bezierCurveTo(Math.cos(M), Math.sin(M), Math.cos(a3) * .4, Math.sin(a3) * .4, Math.cos(A3) * .3, Math.sin(A3) * .3);
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, .15, 0, TAU);
    ctx.fillStyle = colors.cactusLightGreen;
    ctx.fill();
}

export function drawArmor(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.stingerBlack, "#FF0000", hit * .5), .15);

    ctx.beginPath()
    polygon(ctx, 6, 1, Math.PI / 6)
    ctx.arc(0, 0, 0.8, 0, TAU)
    ctx.fill("evenodd")
    ctx.stroke()
    ctx.closePath()
}

function drawJelly(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.jelly, "#FF0000", hit * .5), .2);

    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.closePath();
    ctx.globalAlpha = .7;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.stroke();

    ctx.fillStyle = ctx.strokeStyle;
    ctx.globalAlpha = .7;
    ctx.beginPath();
    ctx.arc(-.1, .35, .4, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(.5, -.4, .2, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-.4, -.3, .3, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.closePath();

    ctx.globalAlpha = 1;
}

function drawYggdrasil(ctx = _ctx, hit = false) {
    const innerColor = mixColors("#aa853f", "#FF0000", hit * .5);
    const outerColor = mixColors("#876e36", "#FF0000", hit * .5);

    // Outer color
    ctx.lineCap = "round";
    ctx.strokeStyle = outerColor;
    ctx.fillStyle = outerColor;
    ctx.beginPath(); // Stem
    ctx.moveTo(1.13, .54);
    ctx.quadraticCurveTo(1.20, .6, 1.16, .69);
    ctx.quadraticCurveTo(1.13, .8, 1.03, .81);
    ctx.quadraticCurveTo(-.52, .14, -.63, -1.13);
    ctx.lineTo(-.56, -1.13);
    ctx.quadraticCurveTo(-.1, .38, 1.13, .54);
    ctx.lineWidth = .4;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath(); // Curvy leaf
    ctx.moveTo(.72, .54);
    ctx.quadraticCurveTo(.3, .97, -.49, .13);
    ctx.quadraticCurveTo(-.92, -.44, -.57, -.98);
    ctx.quadraticCurveTo(-.2, -1.01, .24, -.8);
    ctx.quadraticCurveTo(1.31, -.2, .72, .54);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath(); // Spines
    ctx.lineWidth = .4;
    ctx.moveTo(.97, -.14);
    ctx.quadraticCurveTo(.91, .24, .72, .54);
    ctx.moveTo(.82, -.47);
    ctx.quadraticCurveTo(.78, -.13, .61, .38);
    ctx.moveTo(.66, -.7);
    ctx.quadraticCurveTo(.64, -.38, .43, .26);
    ctx.moveTo(.46, -.79);
    ctx.quadraticCurveTo(.42, -.36, .22, .1);
    ctx.moveTo(.26, -.92);
    ctx.quadraticCurveTo(.21, -.59, .04, -.06);
    ctx.moveTo(.02, -.97);
    ctx.quadraticCurveTo(0, -.72, -.14, -.28);
    ctx.moveTo(-.18, -1.04);
    ctx.quadraticCurveTo(-.17, -.83, -.29, -.47);
    ctx.moveTo(-.38, -1.07);
    ctx.quadraticCurveTo(-.35, -.34, -.74, -.88);
    ctx.moveTo(-.76, -.59);
    ctx.quadraticCurveTo(-.61, -.49, -.4, -.46);
    ctx.moveTo(-.78, -.34);
    ctx.quadraticCurveTo(-.61, -.26, -.3, -.24);
    ctx.moveTo(-.69, -.06);
    ctx.quadraticCurveTo(-.47, -.04, -.15, -.09);
    ctx.moveTo(-.65, .14);
    ctx.quadraticCurveTo(-.47, .15, .05, .05);
    ctx.moveTo(-.53, .33);
    ctx.quadraticCurveTo(-.18, .32, .12, .2);
    ctx.quadraticCurveTo(-.19, .31, .12, .2);
    ctx.moveTo(-.35, .5);
    ctx.quadraticCurveTo(.02, .47, .27, .35);
    ctx.moveTo(-.08, .63);
    ctx.quadraticCurveTo(.15, .6, .49, .47);
    ctx.moveTo(.26, .72);
    ctx.quadraticCurveTo(.5, .72, .72, .54);
    ctx.stroke();

    // Inner color
    ctx.strokeStyle = innerColor;
    ctx.fillStyle = innerColor;
    ctx.beginPath(); // Stem
    ctx.moveTo(1.13, .54);
    ctx.quadraticCurveTo(1.20, .6, 1.16, .69);
    ctx.quadraticCurveTo(1.13, .8, 1.03, .81);
    ctx.quadraticCurveTo(-.52, .14, -.63, -1.13);
    ctx.lineTo(-.56, -1.13);
    ctx.quadraticCurveTo(-.1, .38, 1.13, .54);
    ctx.lineWidth = .1;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    ctx.lineCap = "square";
    ctx.beginPath(); // Curvy leaf
    ctx.lineWidth = .1;
    ctx.moveTo(.72, .54);
    ctx.quadraticCurveTo(.3, .97, -.49, .13);
    ctx.quadraticCurveTo(-.92, -.44, -.57, -.98);
    ctx.quadraticCurveTo(-.2, -1.01, .24, -.8);
    ctx.quadraticCurveTo(1.31, -.2, .72, .54);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath(); // Spines
    ctx.lineWidth = .125;
    ctx.moveTo(.97, -.14);
    ctx.quadraticCurveTo(.91, .24, .72, .54);
    ctx.moveTo(.82, -.47);
    ctx.quadraticCurveTo(.78, -.13, .61, .38);
    ctx.moveTo(.66, -.7);
    ctx.quadraticCurveTo(.64, -.38, .43, .26);
    ctx.moveTo(.46, -.79);
    ctx.quadraticCurveTo(.42, -.36, .22, .1);
    ctx.moveTo(.26, -.92);
    ctx.quadraticCurveTo(.21, -.59, .04, -.06);
    ctx.moveTo(.02, -.97);
    ctx.quadraticCurveTo(0, -.72, -.14, -.28);
    ctx.moveTo(-.18, -1.04);
    ctx.quadraticCurveTo(-.17, -.83, -.29, -.47);
    ctx.moveTo(-.38, -1.07);
    ctx.quadraticCurveTo(-.35, -.34, -.74, -.88);
    ctx.moveTo(-.76, -.59);
    ctx.quadraticCurveTo(-.61, -.49, -.4, -.46);
    ctx.moveTo(-.78, -.34);
    ctx.quadraticCurveTo(-.61, -.26, -.3, -.24);
    ctx.moveTo(-.69, -.06);
    ctx.quadraticCurveTo(-.47, -.04, -.15, -.09);
    ctx.moveTo(-.65, .14);
    ctx.quadraticCurveTo(-.47, .15, .05, .05);
    ctx.moveTo(-.53, .33);
    ctx.quadraticCurveTo(-.18, .32, .12, .2);
    ctx.quadraticCurveTo(-.19, .31, .12, .2);
    ctx.moveTo(-.35, .5);
    ctx.quadraticCurveTo(.02, .47, .27, .35);
    ctx.moveTo(-.08, .63);
    ctx.quadraticCurveTo(.15, .6, .49, .47);
    ctx.moveTo(.26, .72);
    ctx.quadraticCurveTo(.5, .72, .72, .54);
    ctx.stroke();
    ctx.lineCap = "round";
}

function drawGlass(id, ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.unique, "#FF0000", hit * .5), .2);

    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const angle = TAU / 5 * i;
        const dist = 1 + Math.sin(id * 4 + i * 8) * .2;

        ctx.lineTo(Math.cos(angle) * dist, Math.sin(angle) * dist);
    }

    ctx.closePath();

    ctx.globalAlpha = .5;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.stroke();
}

function drawDandy(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.black, "#FF0000", hit * .5), .6);

    ctx.beginPath();
    ctx.moveTo(-1.2, 0);
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.closePath();

    setStyle(ctx, mixColors(colors.white, "#FF0000", hit * .5), .2);
    ctx.beginPath();
    ctx.arc(.2, 0, .75, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawDandyIcon(ctx = _ctx) {
    for (let i = 0; i < 2; i++) {
        const angle = TAU / 2 * i;

        ctx.save();
        ctx.translate(Math.cos(angle) * .75, Math.sin(angle) * .75);
        ctx.rotate(angle + TAU / 5)
        drawDandy(ctx)
        ctx.restore();
    }
}

function drawSpongePetal(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.peach, "#FF0000", hit * .5), .125);

    ctx.beginPath();

    for (let i = 0; i < 7; i++) {
        const angle = i * TAU / 7;
        const max = angle + TAU / 14;

        if (i === 0) {
            const min = angle - TAU / 14;
            ctx.moveTo(Math.cos(min) * .7, Math.sin(min) * .7);
        }

        ctx.quadraticCurveTo(Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, Math.cos(max) * .7, Math.sin(max) * .7);
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawPearl(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.peach, "#FF0000", hit * .5), .2);
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = mixColors(colors.white, "#FF0000", hit * .5);
    ctx.beginPath();
    ctx.arc(.25, -.25, .25, 0, TAU);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = ctx.fillStyle;
    ctx.beginPath();
    ctx.moveTo(-.65, -.35);
    ctx.quadraticCurveTo(-.7, .15, -.35, .55);
    ctx.stroke();
    ctx.closePath();
}

function drawShellPetal(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.peach, "#FF0000", hit * .5), .2);
    ctx.beginPath();
    ctx.moveTo(.3, -.95);
    ctx.quadraticCurveTo(1.5, 0, .3, .95);
    ctx.lineTo(-.8, .3);
    ctx.quadraticCurveTo(-1, 0, -.8, -.3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(.6, 0);
    ctx.lineTo(-.3, 0);
    ctx.moveTo(.2, -.5);
    ctx.lineTo(-.45, -.175);
    ctx.moveTo(.2, .5);
    ctx.lineTo(-.45, .175);
    ctx.stroke();
    ctx.closePath();
}

function drawBubblePetal(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.white, "#FF0000", hit * .5), .2);
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.closePath();
    ctx.globalAlpha = .4;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.stroke();

    ctx.fillStyle = mixColors(colors.bubbleGrey, "#FF0000", hit * .5);
    ctx.beginPath();
    ctx.arc(.25, -.25, .25, 0, TAU);
    ctx.closePath();
    ctx.globalAlpha = .8;
    ctx.fill();
    ctx.globalAlpha = 1;
}

function drawStarfishPetal(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.starfish, "#FF0000", hit * .5), .125);

    ctx.beginPath();
    ctx.moveTo(-1.2, -.5);
    ctx.lineTo(1, -.4);
    ctx.arc(1, 0, .4, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(-1.2, .5);
    ctx.lineTo(-1.3, .3);
    ctx.lineTo(-1.3, -.3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = mixColors(ctx.fillStyle, colors.white, .3);

    ctx.beginPath();
    ctx.arc(-.75, 0, .4, 0, TAU);
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, .3, 0, TAU);
    ctx.moveTo(.667, 0);
    ctx.arc(.667, 0, .2, 0, TAU);
    ctx.fill();
    ctx.closePath();
}

function drawFangPetal(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.evilLadybugRed, "#FF0000", hit * .5), .2);
    ctx.beginPath();
    ctx.moveTo(1, 0);
    ctx.lineTo(0, -.5);
    ctx.lineTo(-1, 0);
    ctx.lineTo(0, .5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawGoo(id, ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.cumWhite, "#FF0000", hit * .5), .2);

    const s1 = Math.sin(performance.now() * .005 + id * .1) * .25 + .75;
    const s2 = Math.sin(performance.now() * .0075 + id * .1 + 1) * .5 + .75;
    const s3 = Math.sin(performance.now() * .001 + id * .1 + 2) * .3 + .75;

    ctx.beginPath();
    ctx.arc(0, 0, 1, Math.PI / 2, -Math.PI / 2, true);
    ctx.bezierCurveTo(-1.5 * s1, -1.3, -1.6 * s2, -1.1, -2.2 * s3, -1);
    ctx.bezierCurveTo(-2.9 * s2, -.8, -2.7 * s3, -.5, -1.6 * s1, -.6);
    ctx.bezierCurveTo(-2.6 * s3, -.4, -2.8 * s1, -.2, -1.6 * s2, 0);
    ctx.bezierCurveTo(-3.7 * s1, .8, -1.7 * s3, 1.2, -1.1 * s2, .9);
    ctx.bezierCurveTo(-1.1, 1.4, -.2, 1.4, 0, 1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawStaticGoo(ctx = _ctx) {
    setStyle(ctx, colors.cumWhite, .2);

    const s1 = Math.sin(.5 * .005) * .25 + .75;
    const s2 = Math.sin(.5 * .0075 + 1) * .5 + .75;
    const s3 = Math.sin(.5 * .001 + 2) * .3 + .75;

    ctx.beginPath();
    ctx.arc(0, 0, 1, Math.PI / 2, -Math.PI / 2, true);
    ctx.bezierCurveTo(-1.5 * s1, -1.3, -1.6 * s2, -1.1, -2.2 * s3, -1);
    ctx.bezierCurveTo(-2.9 * s2, -.8, -2.7 * s3, -.5, -1.6 * s1, -.6);
    ctx.bezierCurveTo(-2.6 * s3, -.4, -2.8 * s1, -.2, -1.6 * s2, 0);
    ctx.bezierCurveTo(-3.7 * s1, .8, -1.7 * s3, 1.2, -1.1 * s2, .9);
    ctx.bezierCurveTo(-1.1, 1.4, -.2, 1.4, 0, 1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function maggotPoo(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.spider, "#FF0000", hit * .5), .2);
    dipPolygon(ctx, 7, 1.05, 1.3);
    ctx.fill();
    ctx.stroke();
    setStyle(ctx, mixColors(mixColors(colors.spider, colors.cumWhite, .15), "#FF0000", hit * .5), .15);
    dipPolygon(ctx, 5, .6, .5);
    ctx.fill();
    ctx.stroke();
    setStyle(ctx, mixColors(mixColors(colors.spider, colors.cumWhite, .3), "#FF0000", hit * .5), .1);
    polygon(ctx, 8, .3);
    ctx.fill();
    ctx.stroke();
}

function drawLightbulb(id, ctx = _ctx, hit = false, isReal = true) {
    if (isReal) {
        ctx.fillStyle = "#FFE51C";
        ctx.globalAlpha = .2;
        ctx.beginPath();
        ctx.arc(0, 0, 2.5 + Math.sin(performance.now() * .005 + id) * 1.75, 0, TAU);
        ctx.closePath();
        ctx.fill();
    }

    ctx.globalAlpha = 1;

    ctx.save();
    ctx.scale(1.15, 1.15);

    setStyle(ctx, mixColors("#ffe51c", "#FF0000", hit * .5), .2);

    ctx.beginPath();
    ctx.moveTo(-.32, .39);
    ctx.bezierCurveTo(-.34, .27, -.4, .17, -.45, .1);
    ctx.bezierCurveTo(-.5, 0, -.57, -.1, -.57, -.24);
    ctx.bezierCurveTo(-.55, -.55, -.3, -.8, 0, -.81);
    ctx.bezierCurveTo(.3, -.8, .55, -.55, .57, -.24);
    ctx.bezierCurveTo(.55, -.1, .5, 0, .45, .1);
    ctx.bezierCurveTo(.4, .17, .34, .27, .32, .39);
    ctx.lineTo(-.32, .39);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    setStyle(ctx, mixColors("#666666", "#FF0000", hit * .5), .2);
    ctx.beginPath();
    ctx.rect(-.36, .39, .72, .5);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";
    ctx.strokeStyle = "#fff28d";
    ctx.beginPath();
    ctx.moveTo(-.2, .3);
    ctx.lineTo(-.3, -.2);
    ctx.lineTo(-.15, -.05);
    ctx.lineTo(0, -.2);
    ctx.lineTo(.15, -.05);
    ctx.lineTo(.3, -.2);
    ctx.lineTo(.2, .3);
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
}

function drawBattery(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors("#C8C8C8", "#FF0000", hit * .5), .2);
    ctx.fillRect(-.25, -1, .5, .5);
    ctx.strokeRect(-.25, -1, .5, .5);

    setStyle(ctx, mixColors("#323233", "#FF0000", hit * .5), .2);
    ctx.fillRect(-.6, -.7, 1.2, 1.7);
    ctx.strokeRect(-.6, -.7, 1.2, 1.7);

    setStyle(ctx, mixColors("#C98A5B", "#FF0000", hit * .5), .2);
    ctx.fillRect(-.6, -.7, 1.2, .5);
    ctx.strokeRect(-.6, -.7, 1.2, .5);
}

function drawDust(ctx = _ctx) {
    setStyle(ctx, colors.rockGray, .2);

    for (let i = 0; i < 3; i++) {
        const angle = TAU / 3 * i;

        ctx.save();
        ctx.translate(Math.cos(angle) * .5, Math.sin(angle) * .5);
        polygon(ctx, 5, .5, angle);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}

function drawShrubPetal(color, ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(color, "#ff0000", hit * .5), .125);

    for (let i = 9; i >= 8; i--) {
        polygon(ctx, i, 1 - (0.33 * (9 - i)), 0);
        ctx.fill();
        ctx.stroke();
    };

    ctx.fillStyle = mixColors(mixColors(color, "#000000", .1), "#ff0000", hit * .5);

    ctx.beginPath();
    ctx.arc(0, 0, .33, 0, TAU);
    ctx.fill();
    ctx.closePath();
}

function drawLantern(color, altColor, ctx = _ctx, hit = false) {
    ctx.fillStyle = altColor;
    ctx.globalAlpha = .5;

    ctx.translate(0, .125)

    ctx.beginPath();
    ctx.arc(0, 0, 1.25 + Math.sin(performance.now() / 750) * .75, 0, TAU);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.globalAlpha = .75;
    ctx.arc(0, 0, .75 + Math.sin(performance.now() / 750) * .25, 0, TAU);
    ctx.fill();
    ctx.closePath();

    ctx.globalAlpha = 1;

    ctx.lineWidth = .25;
    ctx.strokeStyle = mixColors(mixColors(color, "#ffffff", .25), "#ff0000", hit * .5);

    ctx.beginPath();
    ctx.moveTo(1.05, -1);
    ctx.lineTo(.8, 1);

    ctx.moveTo(-1.05, -1);
    ctx.lineTo(-.8, 1);

    ctx.moveTo(.35, -1);
    ctx.lineTo(.25, 1);

    ctx.moveTo(-.35, -1);
    ctx.lineTo(-.25, 1);

    ctx.stroke();
    ctx.closePath();

    setStyle(ctx, mixColors(color, "#ff0000", hit * .5), .25);

    ctx.beginPath();
    ctx.moveTo(1.25, -1);
    ctx.lineTo(1, -1.5);
    ctx.lineTo(-1, -1.5);
    ctx.lineTo(-1.25, -1);
    ctx.lineTo(1.25, -1);

    ctx.moveTo(1, 1);
    ctx.lineTo(.75, 1.125);
    ctx.lineTo(-.75, 1.125);
    ctx.lineTo(-1, 1);
    ctx.lineTo(1, 1);

    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = mixColors(mixColors(color, "#000000", .25), "#ff0000", hit * .5);

    ctx.beginPath();
    ctx.moveTo(.75, -1.5);
    ctx.lineTo(.5, -2);
    ctx.lineTo(-.5, -2);
    ctx.lineTo(-.75, -1.5);
    ctx.stroke();
    ctx.closePath();
}

function drawStaticLantern(color, altColor, ctx = _ctx) {
    ctx.fillStyle = altColor;
    ctx.globalAlpha = .5;

    ctx.translate(0, .125)

    ctx.beginPath();
    ctx.arc(0, 0, 1.25 + .5 * .75, 0, TAU);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.globalAlpha = .75;
    ctx.arc(0, 0, .75 + .5 * .25, 0, TAU);
    ctx.fill();
    ctx.closePath();

    ctx.globalAlpha = 1;

    ctx.lineWidth = .25;
    ctx.strokeStyle = mixColors(color, "#ffffff", .25);

    ctx.beginPath();
    ctx.moveTo(1.05, -1);
    ctx.lineTo(.8, 1);

    ctx.moveTo(-1.05, -1);
    ctx.lineTo(-.8, 1);

    ctx.moveTo(.35, -1);
    ctx.lineTo(.25, 1);

    ctx.moveTo(-.35, -1);
    ctx.lineTo(-.25, 1);

    ctx.stroke();
    ctx.closePath();

    setStyle(ctx, color, .25);

    ctx.beginPath();
    ctx.moveTo(1.25, -1);
    ctx.lineTo(1, -1.5);
    ctx.lineTo(-1, -1.5);
    ctx.lineTo(-1.25, -1);
    ctx.lineTo(1.25, -1);

    ctx.moveTo(1, 1);
    ctx.lineTo(.75, 1.125);
    ctx.lineTo(-.75, 1.125);
    ctx.lineTo(-1, 1);
    ctx.lineTo(1, 1);

    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = mixColors(color, "#000000", .25);

    ctx.beginPath();
    ctx.moveTo(.75, -1.5);
    ctx.lineTo(.5, -2);
    ctx.lineTo(-.5, -2);
    ctx.lineTo(-.75, -1.5);
    ctx.stroke();
    ctx.closePath();
}

function drawHornetEgg(ctx = _ctx) {
    setStyle(ctx, colors.peach, .2);

    for (let i = 0; i < 2; i++) {
        const angle = i * TAU / 2;

        ctx.beginPath();
        ctx.ellipse(Math.cos(angle) * .6, Math.sin(angle) * .6, .775, 1, 0, 0, TAU);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}

const CandyColors = [
    colors.rosePink,
    colors.legendary,
    colors.rare,
    colors.common,
    colors.ancient,
    colors.orange
]

function drawCandy(id, ctx = _ctx, hit) {
    setStyle(ctx, mixColors(CandyColors[id % CandyColors.length], "#ff0000", hit * .5), .25);

    ctx.beginPath();
    ctx.save();
    switch (id % 3) {
        case 0:
            ctx.arc(0, 0, 1, 0, TAU);
            break;
        case 1:
            polygon(ctx, 3, 1.3, 0);
            break;
        case 2:
            ctx.rect(-1, -1, 2, 2);
            break;
    };
    ctx.clip();
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = mixColors(ctx.fillStyle, "#ffffff", .25);

    ctx.beginPath();
    ctx.rotate(Math.PI / 4);
    ctx.rect(-1, -.25, 2, .5);
    ctx.fill();

    ctx.restore();
    ctx.closePath();

    ctx.beginPath()
    switch (id % 3) {
        case 0:
            ctx.arc(0, 0, 1, 0, TAU);
            break;
        case 1:
            polygon(ctx, 3, 1.3, 0);
            break;
        case 2:
            ctx.rect(-1, -1, 2, 2);
            break;
    };
    ctx.stroke();
    ctx.closePath();
}

function drawCandyIcon(ctx = _ctx) {
    for (let i = 0; i < 5; i++) {
        const angle = TAU / 5 * i;

        ctx.save();
        ctx.translate(Math.cos(angle) * .75, Math.sin(angle) * .75);
        ctx.scale(.5, .5);
        ctx.rotate(angle)
        drawCandy(i, ctx, false);
        ctx.restore();
    }
}

function drawClaw(ctx, hit) {
    setStyle(ctx, mixColors(colors.crabLimbBrown, "#ff0000", hit * .5), .25);

    ctx.beginPath();
    ctx.moveTo(-.96, -.31);
    ctx.bezierCurveTo(.5, -.91, .86, .23, 1, .54);
    ctx.lineTo(.4, .09);
    ctx.lineTo(.56, .75);
    ctx.bezierCurveTo(.1, .33, -.38, .02, -1, .22);
    ctx.bezierCurveTo(-.95, .05, -.86, -.12, -.96, -.31);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

export function drawPetal(index, hit = false, ctx = _ctx, id = 0) {
    if (state.petalConfigs[index].drawing) {
        const actions = state.petalConfigs[index].drawing.actions;
        for (const action of actions) {
            const [actionName, ...args] = action;
            const actionFunc = Drawing.reverseActions[actionName];

            if (!actionFunc) {
                throw new Error(`Unknown action: ${actionName} ${action}`);
            }

            switch (actionFunc) {
                case "circle":
                    ctx.arc(args[0], args[1], args[2], 0, Math.PI * 2);
                    break;
                case "line":
                    ctx.moveTo(args[0], args[1]);
                    ctx.lineTo(args[2], args[3]);
                    break;
                case "fill":
                    ctx.fillStyle = args[0];
                    ctx.fill();
                    break;
                case "stroke":
                    ctx.strokeStyle = args[0];
                    ctx.lineWidth = args[1];
                    ctx.stroke();
                    break;
                case "paint":
                    ctx.fillStyle = args[0];
                    ctx.strokeStyle = mixColors(args[0], "#000000", .2);
                    ctx.lineWidth = args[1];
                    ctx.fill();
                    ctx.stroke();
                    break;
                case "polygon":
                    polygon(ctx, args[0], args[1], args[2]);
                    break;
                case "spikeBall":
                    spikeBall(ctx, args[0], args[1], args[2]);
                    break;
                case "dipPolygon":
                    dipPolygon(ctx, args[0], args[1], args[2]);
                    break;
                case "opacity":
                    ctx.globalAlpha = args[0];
                    break;
                case "blur":
                    ctx.shadowColor = args[0];
                    ctx.shadowBlur = args[1];
                    break;
                case "noBlur":
                    ctx.shadowBlur = 0;
                    break;
                default:
                    ctx[actionFunc](...args);
                    break;
            }
        }

        return;
    }

    switch (index) {
        case 0: // Basic
        case 1: // Light
            basicPetal(ctx, hit, colors.white);
            break;
        case 2: // Faster
            basicPetal(ctx, hit, colors.cumWhite);
            break;
        case 3: // Heavy
            drawHeavy(ctx, hit);
            break;
        case 4: // Stinger
            trianglePetal(ctx, hit, colors.stingerBlack);
            break;
        case 5: // Rice
            drawRice(ctx, hit);
            break;
        case 6: // Rock
            drawRockP(ctx, hit);
            break;
        case 7: // Cactus
            drawCactusPetal(ctx, hit);
            break;
        case 8: // Leaf
            drawLeaf(ctx, hit);
            break;
        case 9: // Wing
            drawWing(ctx, hit);
            break;
        case 10: // Bone
            drawBone(ctx, hit);
            break;
        case 11: // Dirt
            drawDirt(ctx, hit);
            break;
        case 12: // Magnolia
            drawMagnolia(ctx, hit);
            break;
        case 13: // Corn
            drawCorn(ctx, hit);
            break;
        case 14: // Sand
            drawSingleSand(ctx, hit);
            break;
        case 15: // Orange
            drawOrange(ctx, hit);
            break;
        case 16: // Missile
            drawMissile(ctx, hit);
            break;
        case 17: // projectile.pea
            basicPetal(ctx, hit, colors.peaGreen);
            break;
        case 18: // Rose
            basicPetal(ctx, hit, colors.rosePink);
            break;
        case 19: // Yin Yang
            drawYinYang(ctx, hit);
            break;
        case 20: // Pollen
            basicPetal(ctx, hit, colors.pollenGold);
            break;
        case 21: // Honey
            drawHoney(ctx, hit);
            break;
        case 22: // Iris
            basicPetal(ctx, hit, colors.irisPurple);
            break;
        case 23: // Web
            drawWebPetal(ctx, hit);
            break;
        case 24: // web.mob.launched
            drawWebMob(ctx, false);
            break;
        case 25: // Third Eye
            drawThirdEye(ctx, hit);
            break;
        case 26: // Pincer
            drawPincer(ctx, hit);
            break;
        case 27: // Egg
            drawEgg(0, colors.peach, ctx, hit);
            break;
        case 28: // Antennae
            drawAntennae(ctx);
            break;
        case 29: // Peas
            drawPeas(ctx, hit, colors.peaGreen);
            break;
        case 30: // Stick
            drawStick(colors.spider, ctx, hit);
            break;
        case 31: // scorpion.projectile
            drawScorpionProjectile(ctx, hit);
            break;
        case 32: // Dahlia
            basicPetal(ctx, hit, colors.rosePink);
            break;
        case 33: // Primrose
            drawPrimrose(ctx, hit, true);
            break;
        case 34: // Fire Spellbook
            drawSpellbook(ctx, hit, true, 0);
            break;
        case 35: // Deity
            drawDeity(ctx, hit);
            break;
        case 36: // Lightning
            drawLightning(ctx, hit);
            break;
        case 37: // Powder
            drawPowderDynamic(id, ctx, hit);
            break;
        case 38: // Ant Eggs
            basicPetal(ctx, hit, colors.peach);
            break;
        case 39: // Yucca
            drawYucca(ctx, hit);
            break;
        case 40: // Magnet
            drawMagnet(ctx, hit);
            break;
        case 41: // Amulet
            drawAmulet(ctx, hit);
            break;
        case 42: // Jelly
            drawJelly(ctx, hit);
            break;
        case 43: // Yggdrasil
            drawYggdrasil(ctx, hit);
            break;
        case 44: // Glass
            drawGlass(id, ctx, hit);
            break;
        case 45: // Dandelion
            drawDandy(ctx, hit);
            break;
        case 46: // Sponge
            drawSpongePetal(ctx, hit);
            break;
        case 47: // Pearl
            drawPearl(ctx, hit);
            break;
        case 48: // Shell
            drawShellPetal(ctx, hit);
            break;
        case 49: // Bubble
            drawBubblePetal(ctx, hit);
            break;
        case 50: // Air
            break;
        case 51: // Starfish
            drawStarfishPetal(ctx, hit);
            break;
        case 52: // Fangs
            drawFangPetal(ctx, hit);
            break;
        case 53: // Goo
            drawGoo(id, ctx, hit);
            break;
        case 54: // Maggot Poo
            maggotPoo(ctx, hit);
            break;
        case 55: // Lightbulb
            drawLightbulb(id, ctx, hit, true);
            break;
        case 56: // Battery
            drawBattery(ctx, hit);
            break;
        case 57: // Dust
            setStyle(ctx, mixColors(colors.rockGray, "#FF0000", hit * .5), .2);
            polygon(ctx, 5, 1, performance.now() * .001 + id);
            ctx.fill();
            ctx.stroke();
            break;
        case 58: // Armor
            drawArmor(ctx, hit)
            break;
        case 59: // wasp.projectile
            drawWaspMissile(ctx, hit);
            break;
        case 60: // Shrub
            drawShrubPetal(colors.shrubGreen, ctx, hit);
            break;
        case 61: // projectile.grape
            basicPetal(ctx, hit, colors.irisPurple);
            break;
        case 62: // Grapes
            drawPeas(ctx, hit, colors.irisPurple);
            break;
        case 63: // Lantern
            drawLantern(colors.rockGray, colors.orange, ctx, hit);
            break;
        case 64: // web.player.launched
            drawYellowWebMob(ctx, false);
            break;
        case 65: // Branch
            drawStick(colors.rockGray, ctx, hit);
            break;
        case 66: // Leech Egg
            drawEgg(0, colors.lighterBlack, ctx, hit);
            break;
        case 67: // Hornet Egg
            drawEgg(0, colors.peach, ctx, hit);
            break;
        case 68: // Candy
            drawCandy(id, ctx, hit);
            break;
        case 69: // Claw
            drawClaw(ctx, hit);
            break;
        case 70: // Diep Bullet
            setStyle(ctx, mixColors(colors.diepBlue, "#FF0000", hit * .5), .45);
            ctx.beginPath();
            ctx.arc(0, 0, 1, 0, TAU);
            ctx.fill();
            ctx.stroke();
            break;
        case 71: // Diep Square
            drawSquareMob(ctx, hit);
            break;
        case 72: // Diep Triangle
            drawTriangleMob(ctx, hit);
            break;
        case 73: // Diep Pentagon
            drawPentagonMob(ctx, hit);
            break;
        default:
            console.log("Unknown petal index: " + index);
            basicPetal(ctx, hit, "#FF0000");
    }
}

export function drawUIPetal(index, rarity, ctx = _ctx) {
    switch (index) {
        case 1: // Light
            drawLight(rarity, ctx);
            break;
        case 2: // Faster
            ctx.save();
            ctx.scale(.6, .6);
            basicPetal(ctx, false, colors.cumWhite);
            ctx.restore();
            break;
        case 4: // Stinger
            drawStinger(rarity, ctx);
            break;
        case 10: // Bone
            ctx.save();
            ctx.scale(1.25, 1.25);
            drawBone(ctx);
            ctx.restore();
            break;
        case 14: // Sand
            drawSands(ctx);
            break;
        case 15: // Orange
            drawOranges(ctx);
            break;
        case 20: // Pollen
            drawPollenIcon(rarity, ctx);
            break;
        case 22: // Iris
            ctx.save();
            ctx.scale(.75, .75);
            basicPetal(ctx, false, colors.irisPurple);
            ctx.restore();
            break;
        case 27: // Egg
            drawEgg(11, colors.peach, ctx);
            break;
        case 28: // Antennae
            ctx.save();
            ctx.translate(0, .75)
            ctx.scale(1.5, 1.5);
            drawAntennae(ctx);
            ctx.restore()
            break;
        case 32: // Dahlia
            drawDahlia(ctx);
            break;
        case 33: // Primrose
            drawPrimrose(ctx, false, false);
            break;
        case 34: // Fire Spellbook
            drawSpellbook(ctx, false, false, 0);
            break;
        case 37: // Powder
            drawPowderStatic(ctx);
            break;
        case 38: // Ant Egg
            drawAntEgg(ctx);
            break;
        case 45: // Dandelion
            drawDandyIcon(ctx);
            break;
        case 46: // Sponge
            ctx.save();
            ctx.scale(1.25, 1.25);
            drawSpongePetal(ctx);
            ctx.restore();
            break;
        case 47: // Pearl
            ctx.save();
            ctx.scale(1.25, 1.25);
            drawPearl(ctx);
            ctx.restore();
            break;
        case 53: // Goo
            ctx.save();
            ctx.translate(.5, 0);
            ctx.scale(.9, .9);
            drawStaticGoo(ctx);
            ctx.restore();
            break;
        case 55: // Lightbulb
            drawLightbulb(0, ctx, false, false);
            break;
        case 57: // Dust
            ctx.save();
            ctx.scale(1.1, 1.1);
            drawDust(ctx);
            ctx.restore()
            break;
        case 63: // Lantern
            ctx.save();
            ctx.scale(.8, .8);
            drawStaticLantern(colors.rockGray, colors.orange, ctx);
            ctx.restore();
            break;
        case 67: // Hornet Egg
            drawHornetEgg(ctx);
            break;
        case 68: // Candy
            ctx.save();
            ctx.scale(1.05, 1.05);
            drawCandyIcon(ctx);
            ctx.restore();
            break;
        default:
            drawPetal(index, false, ctx);
    }
}

function getUIPetalName(index) {
    switch (index) {
        case 27:
            return "Egg";
        case 38:
            return "Eggs";
        case 66:
            return "Egg";
        case 67:
            return "Eggs";
        default:
            return state.petalConfigs[index].name;
    }
}

const petalIconCache = [];

function createPetalIcon(index, rarity) {
    const canvas = new OffscreenCanvas(128, 128);
    const ctx = canvas.getContext("2d");
    const petalText = getUIPetalName(index)
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.save();

    ctx.beginPath();
    ctx.roundRect(4, 4, 120, 120, 8);

    ctx.strokeStyle = mixColors(state.tiers[rarity].color, "#000000", .2);
    ctx.fillStyle = state.tiers[rarity].color;
    ctx.lineWidth = 12;
    ctx.fill();
    ctx.stroke();

    ctx.translate(128 * .5, 128 * .4);
    ctx.scale(128 * .2, 128 * .2);
    drawUIPetal(index, rarity, ctx);

    ctx.restore();

    let size = 30,
        k = 0;

    while (true) {
        ctx.font = `bold ${size}px sans-serif`;

        if (ctx.measureText(petalText).width < 96 || k++ > 512) {
            break;
        }

        size--;
    }

    text(petalText, 64, 100, size, "#FFFFFF", ctx);

    return canvas;
}

export function getPetalIcon(index, rarity) {
    if (!petalIconCache[index]) {
        petalIconCache[index] = [];
    }

    if (!petalIconCache[index][rarity]) {
        petalIconCache[index][rarity] = createPetalIcon(index, rarity);
    }

    return petalIconCache[index][rarity];
}

const ratioFontSizeCache = [];

const ratioPath = new Path2D();
ratioPath.roundRect(4, 4, 120, 120, 8);

const ratioClip = new Path2D();
ratioClip.rect(0, 0, 128, 128);

const measuringCanvas = new OffscreenCanvas(128, 128);
const measuringCtx = measuringCanvas.getContext("2d");

function measureText(text, max) {
    let size = 30,
        k = 0;

    while (true) {
        measuringCtx.font = `bold ${size}px sans-serif`;

        if (measuringCtx.measureText(text).width < max || k++ > 512) {
            break;
        }

        size--;
    }

    return size;
}

export function drawPetalIconWithRatio(index, rarity, x, y, size, ratio, ctx = _ctx) {

    const petalText = getUIPetalName(index)

    ctx.save();

    ctx.translate(x, y);
    ctx.scale(size / 128, size / 128);

    ctx.clip(ratioClip, "evenodd");

    ctx.fillStyle = mixColors(state.tiers[rarity].color, "#000000", .1);
    ctx.fill(ratioPath);

    ctx.fillStyle = state.tiers[rarity].color;
    ctx.fillRect(4, 124, 120, -120 * ratio);

    ctx.strokeStyle = mixColors(state.tiers[rarity].color, "#000000", .2);
    ctx.lineWidth = 12;
    ctx.stroke(ratioPath);

    ctx.save();
    ctx.translate(128 * .5, 128 * .4);
    ctx.scale(128 * .2, 128 * .2);

    drawUIPetal(index, rarity, ctx);
    ctx.restore();

    if (ratioFontSizeCache[index] === undefined) {
        ratioFontSizeCache[index] = measureText(petalText, 96);
    }

    text(petalText, 64, 100, ratioFontSizeCache[index], "#FFFFFF", ctx);

    ctx.restore();
}

function drawLadybug(id, color, hit = false, ctx = _ctx) {
    const black = mixColors(colors.stingerBlack, "#FF0000", hit * .5);
    const myColor = mixColors(color, "#FF0000", hit * .5);
    // Ladybug head
    ctx.beginPath();
    ctx.arc(.2, 0, .7, 0, TAU);
    setStyle(ctx, black, .15);
    ctx.fill();
    ctx.stroke();

    // Ladybug Body
    ctx.fillStyle = myColor;
    ctx.beginPath();
    ctx.arc(0, 0, 1, -Math.PI * .2125, Math.PI * .2125, true);
    ctx.arc(.9, 0, .625, Math.PI * .6, -Math.PI * .6, false);
    ctx.closePath();
    ctx.fill();

    ctx.save();
    ctx.clip();

    // Spots
    ctx.fillStyle = black;
    const amount = 2 + Math.abs(Math.sin(id) * .667) * 10 | 0;

    for (let i = 0; i < amount; i++) {
        const angle = Math.sin(i * 100 + id) * TAU;
        const radius = Math.sin(i * 1000 + id) * .1 + .2;
        const d = Math.sin(i * 10000 + id) * .3 + .7;

        ctx.beginPath();
        ctx.arc(Math.cos(angle) * d, Math.sin(angle) * d, radius, 0, TAU);
        ctx.fill();
    }

    ctx.restore();

    // Ladybug stroke
    setStyle(ctx, myColor, .15);
    ctx.beginPath();
    ctx.arc(0, 0, 1, -Math.PI * .2125, Math.PI * .2125, true);
    ctx.arc(.9, 0, .625, Math.PI * .6, -Math.PI * .6, false);
    ctx.closePath();
    ctx.stroke();
}

function drawRock(id, rarity, hit = false, ctx = _ctx) {
    const sides = Math.max(5 + rarity, 4 + (8 + rarity) * ((Math.sin(id) * .5 + .25) * ((rarity + 1) * .25)));
    const radius = 1;
    const angle = TAU / sides;

    setStyle(ctx, mixColors(colors.rockGray, "#FF0000", hit * .5), .2 / (rarity * .1 + 1));
    ctx.beginPath();
    ctx.moveTo(Math.cos(0) * radius, Math.sin(0) * radius);

    for (let i = 1; i < sides; i++) {
        const radISeed = Math.sin(i * 1000 + id) * .1 * (i % 2 ? .5 : 0);
        const radI = radius + radISeed;

        let a = angle * i;

        if (i % 3 === 0) {
            a += Math.sin(id) * .1;
        }

        ctx.lineTo(Math.cos(a) * radI, Math.sin(a) * radI);
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawBee(id, hit = false, ctx = _ctx) {
    const black = mixColors(colors.stingerBlack, "#FF0000", hit * .5);
    const yellow = mixColors(colors.beeYellow, "#FF0000", hit * .5);

    ctx.fillStyle = ctx.strokeStyle = black;
    ctx.lineWidth = .1;

    const stingerRotation = (performance.now() + id * 120) % (3000 + id * 2) > (2500 + id * 2) ? Math.sin(performance.now() / 60 + id * .1) * .025 : 0;

    ctx.beginPath();
    ctx.moveTo(-1.23, stingerRotation);
    ctx.lineTo(-.65, -.41);
    ctx.lineTo(-.65, .41);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    setStyle(ctx, yellow, .1);
    ctx.beginPath();
    ctx.ellipse(0, 0, 1, .667, 0, 0, TAU);
    ctx.closePath();
    ctx.fill();

    ctx.save();
    ctx.clip();

    ctx.beginPath();
    ctx.rect(-1, -1, .334, 2);
    ctx.rect(-.334, -1, .334, 2);
    ctx.rect(.334, -1, .334, 2);
    ctx.fillStyle = black;
    ctx.fill();

    ctx.restore();

    ctx.beginPath();
    ctx.ellipse(0, 0, 1, .667, 0, 0, TAU);
    ctx.closePath();
    ctx.stroke();

    const rotation = 1 + Math.sin(performance.now() / 334 + id * .2) * .1;

    setStyle(ctx, black, .1);
    ctx.beginPath();
    ctx.moveTo(.85, -.15);
    ctx.quadraticCurveTo(1.25, -.2, 1.4, -.45 * rotation);
    ctx.moveTo(.85, .15);
    ctx.quadraticCurveTo(1.25, .2, 1.4, .45 * rotation);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(1.4, -.45 * rotation, .15, 0, TAU);
    ctx.arc(1.4, .45 * rotation, .15, 0, TAU);
    ctx.closePath();
    ctx.fill();
}

function drawSpider(id, attack = false, hit = false, ctx = _ctx) {
    // Legs
    ctx.strokeStyle = mixColors(colors.stingerBlack, "#FF0000", hit * .5);
    ctx.lineWidth = .2;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
        const rot = i * .52 - .79 + Math.cos(performance.now() * (.0025 + (attack * .0125)) + i + id / 3) * .2;

        ctx.rotate(rot);
        ctx.moveTo(0, -2.2);
        ctx.quadraticCurveTo(.2, -1, 0, 0);
        ctx.quadraticCurveTo(-.2, 1, 0, 2.2);
        ctx.rotate(-rot);
    }
    ctx.stroke();
    ctx.closePath();

    // Body
    setStyle(ctx, mixColors(colors.spider, "#FF0000", hit * .5), .2);
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawBeetle(id, color, hit = false, ctx = _ctx, attack = false) {
    const pincerRot = Math.sin(performance.now() * (.0075 + .0075 * attack) + id / 4) * .15 + Math.PI / 20;

    setStyle(ctx, mixColors(colors.stingerBlack, "#FF0000", hit * .5), .1);
    ctx.save();
    ctx.translate(.9, -.4);
    ctx.rotate(pincerRot);
    ctx.beginPath();
    ctx.lineTo(-.2805, -.1445);
    ctx.quadraticCurveTo(.306, -.374, .6885, -.085);
    ctx.quadraticCurveTo(.7905, -.0085, .697, .0765);
    ctx.quadraticCurveTo(.3655, 0, -.2125, .204);
    ctx.closePath();
    ctx.fill();
    ctx.rotate(-pincerRot);
    ctx.translate(0, .8);
    ctx.rotate(-pincerRot);
    ctx.beginPath();
    ctx.lineTo(-.2805, .1445);
    ctx.quadraticCurveTo(.306, .374, .6885, .085);
    ctx.quadraticCurveTo(.7905, .0085, .697, -.0765);
    ctx.quadraticCurveTo(.3655, 0, -.2125, -.204);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    setStyle(ctx, mixColors(color, "#FF0000", hit * .5), .125);
    ctx.beginPath();
    ctx.moveTo(1, 0);
    ctx.bezierCurveTo(1, 1, -1, 1, -1, 0);
    ctx.bezierCurveTo(-1, -1, 1, -1, 1, 0);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(-.667, -.025);
    ctx.quadraticCurveTo(.1, .1, .667, -.025);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(-.45, -.3, .15, 0, TAU);
    ctx.arc(0, -.3, .15, 0, TAU);
    ctx.arc(.45, -.3, .15, 0, TAU);
    ctx.moveTo(-.45, .3);
    ctx.arc(-.45, .3, .15, 0, TAU);
    ctx.arc(0, .3, .15, 0, TAU);
    ctx.arc(.45, .3, .15, 0, TAU);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
}

function drawLeafbug(id, attack = false, hit = false, ctx = _ctx) {
    ctx.strokeStyle = mixColors(colors.lighterBlack, "#FF0000", hit * .5);
    ctx.lineWidth = .2;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
        const rot = i * .52 - .79 + Math.cos(performance.now() * (.0025 + (attack * .0125)) + i + id / 3) * .2;

        ctx.rotate(rot);
        ctx.moveTo(-.1, -.8);
        ctx.quadraticCurveTo(.1, -.8, -.1, 0);
        ctx.quadraticCurveTo(.1, .8, -.1, .8);
        ctx.rotate(-rot);
    }
    ctx.stroke();
    ctx.closePath();

    // Pincer
    const pincerRot = Math.sin(performance.now() * (.005 + (attack * .01)) + id / 4) * .15 + Math.PI / 10;
    ctx.fillStyle = ctx.strokeStyle;
    ctx.save();
    ctx.translate(.6, -.2);
    ctx.rotate(pincerRot);
    scorpionPincer(ctx);
    ctx.rotate(-pincerRot);
    ctx.scale(1, -1);
    ctx.translate(0, -.4);
    ctx.rotate(pincerRot);
    scorpionPincer(ctx);
    ctx.rotate(-pincerRot);
    ctx.restore();

    setStyle(ctx, mixColors(colors.leafGreen, "#FF0000", hit * .5), .125);
    ctx.beginPath();
    ctx.moveTo(.6609, .4525);
    ctx.quadraticCurveTo(.2989, .6336, -.1536, .5431);
    ctx.quadraticCurveTo(-.5157, .4525, -.7872, .2715);
    ctx.quadraticCurveTo(-1.104, .0453, -.8777, -.181);
    ctx.quadraticCurveTo(-.6062, -.4525, -.1536, -.5431);
    ctx.quadraticCurveTo(.2989, -.6336, .7062, -.4073);
    ctx.quadraticCurveTo(1.2493, .0453, .6609, .4525);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(.65, .05);
    ctx.lineTo(.55, 0);
    ctx.lineTo(.25, .25);
    ctx.lineTo(.5, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(-.3, .25);
    ctx.lineTo(-.1, 0);
    ctx.lineTo(-.55, 0);
    ctx.lineTo(-.1, 0);
    ctx.lineTo(-.3, -.25);
    ctx.lineTo(0, 0);
    ctx.lineTo(.5, 0);
    ctx.lineTo(.25, -.25);
    ctx.lineTo(.55, 0);
    ctx.lineTo(.65, -.05);
    ctx.closePath();
    ctx.stroke();
}

function drawRoach(hit = false, ctx = _ctx) {
    setStyle(ctx, mixColors(colors.roachHead, "#FF0000", hit * .5), .125);
    ctx.beginPath();
    ctx.arc(.6, 0, .4, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    setStyle(ctx, mixColors(colors.roach, "#FF0000", hit * .5), .125);
    ctx.beginPath();
    ctx.ellipse(0, 0, 1, .65, 0, .675, -.675);
    ctx.quadraticCurveTo(.3, 0, .785, .35);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = ctx.strokeStyle;
    ctx.beginPath();
    ctx.ellipse(.3, -.25, .15, .2, Math.PI / 10, 0, TAU);
    ctx.ellipse(.3, .25, .15, .2, -Math.PI / 10, 0, TAU);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-.6, .15);
    ctx.quadraticCurveTo(-.3, .35, 0, .3);
    ctx.moveTo(-.6, -.15);
    ctx.quadraticCurveTo(-.3, -.35, 0, -.3);
    ctx.stroke();
    ctx.closePath();

    setStyle(ctx, mixColors(colors.lighterBlack, "#FF0000", hit * .5), .125);
    ctx.beginPath();
    ctx.moveTo(.85, .16);
    ctx.quadraticCurveTo(1.36, .18, 1.68, .49);
    ctx.quadraticCurveTo(1.26, .3, .85, .16);
    ctx.moveTo(.85, -.16);
    ctx.quadraticCurveTo(1.36, -.18, 1.68, -.49);
    ctx.quadraticCurveTo(1.26, -.3, .85, -.16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawHornet(id, color, altColor, hit = false, ctx = _ctx) {
    const myColor = mixColors(color, "#FF0000", hit * .5);
    const myAltColor = mixColors(altColor, "#FF0000", hit * .5);
    setStyle(ctx, myAltColor, .1);

    const stingerRotation = (performance.now() + id * 240) % (9000 + id * 8) > (8500 + id * 4) ? Math.sin(performance.now() / 60 + id * .1) * .025 : 0;

    ctx.beginPath();
    ctx.moveTo(-1.55, stingerRotation);
    ctx.lineTo(-.25, -.4);
    ctx.lineTo(-.25, .4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    setStyle(ctx, myColor, .1);
    ctx.beginPath();
    ctx.ellipse(0, 0, 1, .667, 0, 0, TAU);
    ctx.closePath();
    ctx.fill();

    ctx.save();
    ctx.clip();

    ctx.beginPath();
    ctx.rect(-1, -1, .334, 2);
    ctx.rect(-.334, -1, .334, 2);
    ctx.rect(.334, -1, .334, 2);
    ctx.fillStyle = myAltColor;
    ctx.fill();

    ctx.restore();

    ctx.beginPath();
    ctx.ellipse(0, 0, 1, .667, 0, 0, TAU);
    ctx.closePath();
    ctx.stroke();

    setStyle(ctx, myAltColor, .1);

    ctx.beginPath();
    ctx.moveTo(.85, .16);
    ctx.quadraticCurveTo(1.36, .18, 1.68, .49);
    ctx.quadraticCurveTo(1.26, .3, .85, .16);
    ctx.moveTo(.85, -.16);
    ctx.quadraticCurveTo(1.36, -.18, 1.68, -.49);
    ctx.quadraticCurveTo(1.26, -.3, .85, -.16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawMantis(id, attack = false, hit = false, ctx = _ctx) {
    const black = mixColors(colors.lighterBlack, "#FF0000", hit * .5);
    setStyle(ctx, black, .125);

    // Legs
    ctx.beginPath();
    const legSpeed = attack ? .0075 : .0025;
    for (let i = 0; i < 3; i++) {
        const k = [0, .1, .3][i];
        ctx.moveTo(.35 - .25 * i, -.2);
        ctx.lineTo(.5 - .4 * i - k - Math.sin(performance.now() * legSpeed + id / 6 + i) * .1, .75 + .2 * Math.sin(i + .5));
        ctx.moveTo(.35 - .25 * i, .2);
        ctx.lineTo(.5 - .4 * i - k + Math.sin(performance.now() * legSpeed + id / 3 + i / 3) * .1, -.75 - .2 * Math.sin(i + .5));
    }
    ctx.stroke();
    ctx.closePath();

    setStyle(ctx, mixColors(colors.peaGreen, "#FF0000", hit * .5), .125);
    ctx.beginPath();
    ctx.ellipse(0, 0, 1, .65, 0, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-.55, 0);
    ctx.lineTo(.15, 0);
    ctx.moveTo(.3, -.35);
    ctx.quadraticCurveTo(.15, 0, .3, .35);
    ctx.moveTo(-.45, .225);
    ctx.quadraticCurveTo(-.3, .35, 0, .4);
    ctx.moveTo(-.45, -.225);
    ctx.quadraticCurveTo(-.3, -.35, 0, -.4);
    ctx.stroke();

    setStyle(ctx, black, .125);
    ctx.beginPath();
    ctx.moveTo(.85, .16);
    ctx.quadraticCurveTo(1.36, .18, 1.68, .49);
    ctx.quadraticCurveTo(1.26, .3, .85, .16);
    ctx.moveTo(.85, -.16);
    ctx.quadraticCurveTo(1.36, -.18, 1.68, -.49);
    ctx.quadraticCurveTo(1.26, -.3, .85, -.16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

const pupaPath = new Path2D("M.96-.33C.72-.6-.91-.83-.84-.33Q-1.04 0-.84.33C-.91.83.72.6.96.33L.8.27A.03.03 90 11.8-.27Z");
function drawPupa(hit = false, ctx = _ctx) {
    ctx.save();
    ctx.scale(1.334, 1.334);
    setStyle(ctx, mixColors(colors.peaGreen, "#FF0000", hit * .5), .1);
    ctx.beginPath();
    ctx.arc(.6, 0, .325, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = ctx.strokeStyle;
    ctx.beginPath();
    ctx.arc(.7, -.08, .07, 0, TAU);
    ctx.arc(.7, .08, .07, 0, TAU);
    ctx.closePath();
    ctx.fill();

    setStyle(ctx, mixColors(colors.spider, "#FF0000", hit * .5), .1);
    ctx.fill(pupaPath);
    ctx.stroke(pupaPath);

    ctx.beginPath();
    ctx.moveTo(.65, -.35);
    ctx.bezierCurveTo(.65, -.35, -.05, -.45, -.6, -.1);
    ctx.moveTo(.65, .35);
    ctx.bezierCurveTo(.65, .35, -.05, .45, -.6, .1);
    ctx.moveTo(-.475, -.4);
    ctx.bezierCurveTo(-.475, -.4, -.8, -.2, -.7, -.1);
    ctx.moveTo(-.475, .4);
    ctx.bezierCurveTo(-.475, .4, -.8, .2, -.7, .1);
    ctx.moveTo(.475, -.25);
    ctx.bezierCurveTo(.475, -.25, .375, 0, .4, .25);
    ctx.moveTo(.275, -.2);
    ctx.bezierCurveTo(.2, -.2, .175, 0, .275, .2);
    ctx.moveTo(.1, 0);
    ctx.bezierCurveTo(-.2, -.1, -.4, .1, -.6, 0);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

function drawSandstorm(id, color, attack = false, hit = false, ctx = _ctx) {
    const baseRot = performance.now() * (attack ? .0075 : .0025) + id / 3;

    const myCol = mixColors(color, "#FF0000", hit * .5);

    polygon(ctx, 6, 1, baseRot);
    ctx.fillStyle = ctx.strokeStyle = myCol;
    ctx.lineWidth = .25;
    ctx.fill();
    ctx.stroke();

    polygon(ctx, 6, .667, -baseRot * .8);
    ctx.fillStyle = ctx.strokeStyle = mixColors(myCol, "#000000", .2);
    ctx.lineWidth = .25;
    ctx.fill();
    ctx.stroke();

    polygon(ctx, 6, .334, baseRot * .6);
    ctx.fillStyle = ctx.strokeStyle = mixColors(myCol, "#000000", .4);
    ctx.lineWidth = .25;
    ctx.fill();
    ctx.stroke();
}

function drawScorpion(id, hit = false, ctx = _ctx) {
    setStyle(ctx, mixColors(colors.stingerBlack, "#FF0000", hit * .5), .125);

    // Legs
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
        ctx.moveTo(.35 - .5 * i, -.2);
        ctx.lineTo(.5 - .5 * i - Math.sin(performance.now() / 400 + id / 6 + i) * .1, .75 + .2 * Math.sin(i));
        ctx.moveTo(.35 - .5 * i, .2);
        ctx.lineTo(.5 - .5 * i + Math.sin(performance.now() / 400 + id / 3 + i) * .1, -.75 - .2 * Math.sin(i));
    }
    ctx.stroke();
    ctx.closePath();

    // Pincer
    const pincerRot = Math.sin(performance.now() * .005 + id / 4) * .15 + Math.PI / 10;
    ctx.fillStyle = ctx.strokeStyle;
    ctx.save();
    ctx.translate(.6, -.2);
    ctx.rotate(pincerRot);
    scorpionPincer(ctx);
    ctx.rotate(-pincerRot);
    ctx.scale(1, -1);
    ctx.translate(0, -.4);
    ctx.rotate(pincerRot);
    scorpionPincer(ctx);
    ctx.rotate(-pincerRot);
    ctx.restore();

    setStyle(ctx, mixColors(colors.scorpionBrown, "#FF0000", hit * .5), .125);

    // Body
    ctx.beginPath();
    ctx.moveTo(-1, 0);
    ctx.bezierCurveTo(-1, -1.2, 1, -.7, 1, 0);
    ctx.bezierCurveTo(1, .7, -1, 1.2, -1, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Main body designs
    ctx.beginPath();
    ctx.moveTo(.65, -.3);
    ctx.quadraticCurveTo(.85, 0, .65, .3);
    ctx.moveTo(.3, -.4);
    ctx.quadraticCurveTo(.5, 0, .3, .4);
    ctx.moveTo(0, -.4);
    ctx.quadraticCurveTo(-.15, 0, 0, .4);
    ctx.moveTo(-.45, -.5);
    ctx.quadraticCurveTo(-.7, 0, -.45, .5);
    ctx.stroke();
    ctx.closePath();

    // Tail/Head
    ctx.beginPath();
    ctx.moveTo(-1.2, 0);
    ctx.bezierCurveTo(-1.2, -.6, -.25, -.3, -.25, 0);
    ctx.bezierCurveTo(-.25, .3, -1.2, .6, -1.2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Tail/Head designs
    ctx.lineWidth = .1;
    ctx.beginPath();
    ctx.moveTo(-1, -.125);
    ctx.quadraticCurveTo(-1.1, 0, -1, .125);
    ctx.moveTo(-.65, -.175);
    ctx.quadraticCurveTo(-.85, 0, -.65, .175);
    ctx.stroke();
    ctx.closePath();

    // Stinger
    setStyle(ctx, mixColors(colors.stingerBlack, "#FF0000", hit * .5), .1);
    ctx.beginPath();
    ctx.moveTo(-.1, 0);
    ctx.lineTo(-.35, -.15);
    ctx.lineTo(-.35, .15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawDemon(id, hit = false, ctx = _ctx, attack = false) {
    // Legs
    ctx.strokeStyle = mixColors(colors.lighterBlack, "#FF0000", hit * .5);
    ctx.lineWidth = .2;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
        const rot = i * .52 - .79 + Math.cos(performance.now() * (.001 + (attack * .005)) + i + id / 3) * .2;

        ctx.rotate(rot);
        ctx.moveTo(-.1, -.9);
        ctx.quadraticCurveTo(.1, -.9, -.1, 0);
        ctx.quadraticCurveTo(.1, .9, -.1, .9);
        ctx.rotate(-rot);
    }
    ctx.stroke();
    ctx.closePath();

    // Eye
    setStyle(ctx, mixColors(colors.honeyGold, "#FF0000", hit * .5), .05);
    ctx.beginPath();
    ctx.arc(.7, 0, .35, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Eye angry line thing idfk
    setStyle(ctx, mixColors(colors.stingerBlack, "#FF0000", hit * .5), .1);
    ctx.beginPath();
    ctx.moveTo(.9, .15);
    ctx.quadraticCurveTo(attack ? .8 : 1, 0, .9, -.15);
    ctx.stroke();

    // Body
    setStyle(ctx, mixColors(colors.hellMobColor, "#FF0000", hit * .5), .125);
    ctx.beginPath();
    ctx.moveTo(.8, .3);
    ctx.bezierCurveTo(.7, 1, -1, 1, -1, 0);
    ctx.bezierCurveTo(-1, -1, .7, -1, .8, -.3);
    ctx.quadraticCurveTo(.7, 0, .8, .3);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(-.667, -.025);
    ctx.quadraticCurveTo(.1, Math.sin(id * 3 + performance.now() / 534) * .1, .334, -.025);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(-.45, -.3, .15, 0, TAU);
    ctx.arc(0, -.3, .15, 0, TAU);
    ctx.arc(.45, -.3, .15, 0, TAU);
    ctx.moveTo(-.45, .3);
    ctx.arc(-.45, .3, .15, 0, TAU);
    ctx.arc(0, .3, .15, 0, TAU);
    ctx.arc(.45, .3, .15, 0, TAU);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
}

function drawJellyfish(id, attack = false, hit = false, ctx = _ctx) {
    setStyle(ctx, mixColors(colors.jellyfish, "#FF0000", hit * .5), .125);
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.closePath();

    ctx.globalAlpha = .5;
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.stroke();

    const insider = (performance.now() * .00125 + id / 4) * (attack * 2 + 1);

    for (let i = 0; i < 8; i++) {
        ctx.rotate(TAU / 8 * i);

        const angle = Math.sin(insider * (1 + i / 8)) * .3 * (1 - (i % 2) * .2);

        ctx.beginPath();
        ctx.moveTo(.8, 0);
        ctx.lineTo(1.6, angle);
        ctx.closePath();
        ctx.stroke();

        ctx.rotate(-TAU / 8 * i);
    }
}

const cactusSides = [7, 9, 12, 16, 24, 28, 32, 32, 32, 38, 38, 40];
function drawCactusMob(rarity, hit = false, ctx = _ctx) {
    const sides = cactusSides[rarity];

    const spikeCenter = .925;
    setStyle(ctx, mixColors(colors.stingerBlack, "#FF0000", hit * .5), .1);
    ctx.beginPath();

    for (let i = 0; i < sides; i++) {
        const angle = TAU / sides * i;

        ctx.save();
        ctx.translate(Math.cos(angle) * spikeCenter, Math.sin(angle) * spikeCenter);
        ctx.rotate(angle);

        ctx.moveTo(.2, 0);
        ctx.lineTo(0, -.1);
        ctx.lineTo(0, .1);
        ctx.lineTo(.2, 0);

        ctx.restore();
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    setStyle(ctx, mixColors(colors.cactusGreen, "#FF0000", hit * .5), .1);
    dipPolygon(ctx, sides, 1, 6 * (sides / 24));
    ctx.fill();
    ctx.stroke();
}

function antHead(x, y, s, id, rotSpd, hit = false, ctx = _ctx) {
    ctx.save();

    ctx.strokeStyle = mixColors("#2A2A2A", "#FF0000", hit * .5);;
    ctx.lineWidth = .5;

    ctx.translate(x, y);
    ctx.scale(s, s);

    const rotation = Math.sin(performance.now() * rotSpd + id / 4) * .075;

    ctx.beginPath();
    ctx.moveTo(0, -.7);
    ctx.rotate(-rotation);
    ctx.quadraticCurveTo(1.25, -.5, 1.5, -.4);
    ctx.closePath();
    ctx.stroke();

    ctx.rotate(rotation);

    ctx.beginPath();
    ctx.moveTo(0, .7);
    ctx.rotate(rotation);
    ctx.quadraticCurveTo(1.25, .5, 1.5, .4);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();

    ctx.beginPath();
    ctx.arc(x, y, s, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function termiteHead(x, y, s, id, rotSpd, hit = false, ctx = _ctx) {
    ctx.save();

    ctx.strokeStyle = mixColors("#2A2A2A", "#FF0000", hit * .5);;
    ctx.lineWidth = .5;

    ctx.translate(x, y);
    ctx.scale(s, s);

    const rotation = Math.sin(performance.now() * rotSpd + id / 4) * .075;

    ctx.beginPath();
    ctx.moveTo(0, -.7);
    ctx.rotate(-rotation);
    ctx.lineTo(1.25, -.5);
    ctx.lineTo(1.5, -.25);
    ctx.closePath();
    ctx.stroke();

    ctx.rotate(rotation);

    ctx.beginPath();
    ctx.moveTo(0, .7);
    ctx.rotate(rotation);
    ctx.lineTo(1.25, .5);
    ctx.lineTo(1.5, .25);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();

    ctx.beginPath();
    ctx.arc(x, y, s, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawWings(x, y, s, id, rotSpd, hit = false, ctx = _ctx) {
    const rotation = Math.sin(performance.now() * rotSpd + id / 5) * .3 + Math.PI / 10;

    ctx.save();
    ctx.globalAlpha = .5;
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.fillStyle = mixColors("#9FA0A0", "#FF0000", hit * .5);

    ctx.beginPath();
    ctx.rotate(rotation);
    ctx.ellipse(0, -.3, 1.35, .5, 0, 0, TAU);
    ctx.rotate(-rotation * 2);
    ctx.ellipse(0, .3, 1.35, .5, 0, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawBabyAntT(id, fillColor, attk = false, hit = false, ctx = _ctx) {
    setStyle(ctx, mixColors(fillColor, "#FF0000", hit * .5), .4);
    antHead(0, 0, 1, id, .005 + (attk * .0025), hit, ctx);
}

function drawWorkerAntT(id, fillColor, attk = false, hit = false, ctx = _ctx) {
    setStyle(ctx, mixColors(fillColor, "#FF0000", hit * .5), .4);

    ctx.beginPath();
    ctx.arc(-1.1, 0, .667, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    antHead(0, 0, 1, id, .005 + (attk * .003), hit, ctx);
}

function drawSoldierAntT(id, fillColor, attk = false, hit = false, ctx = _ctx) {
    setStyle(ctx, mixColors(fillColor, "#FF0000", hit * .5), .4);

    ctx.beginPath();
    ctx.arc(-1.1, 0, .667, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    drawWings(-.667, 0, 1.25, id, .002 + (attk * .0025), hit, ctx);
    antHead(0, 0, 1, id, .005 + (attk * .0035), hit, ctx);
}

function drawQueenAntT(id, fillColor, attk = false, hit = false, ctx = _ctx) {
    setStyle(ctx, mixColors(fillColor, "#FF0000", hit * .5), .4);

    ctx.beginPath();
    ctx.arc(-2, 0, 1.3, 0, TAU);
    ctx.arc(-1.1, 0, 1.15, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    drawWings(-.667, 0, 1.25, id, .002 + (attk * .003), hit, ctx);
    antHead(0, 0, 1, id, .005 + (attk * .004), hit, ctx);
}

function drawAntHoleT(fillColor, hit = false, ctx = _ctx) {
    ctx.fillStyle = mixColors(fillColor, "#FF0000", hit * .5);
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = mixColors(ctx.fillStyle, "#000000", .2);
    ctx.beginPath();
    ctx.arc(0, 0, .75, 0, TAU);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = mixColors(ctx.fillStyle, "#000000", .25);
    ctx.beginPath();
    ctx.arc(0, 0, .5, 0, TAU);
    ctx.closePath();
    ctx.fill();
}

function drawBabyAnt(id, attack, hit, ctx = _ctx) {
    drawBabyAntT(id, colors.ants, attack, hit, ctx);
}

function drawWorkerAnt(id, attack, hit, ctx = _ctx) {
    drawWorkerAntT(id, colors.ants, attack, hit, ctx);
}

function drawSoldierAnt(id, attack, hit, ctx = _ctx, friend = false) {
    drawSoldierAntT(id, friend ? colors.playerYellow : colors.ants, attack, hit, ctx);
}

function drawQueenAnt(id, attack, hit, ctx = _ctx) {
    drawQueenAntT(id, colors.ants, attack, hit, ctx);
}

function drawAntHole(hit, ctx = _ctx) {
    drawAntHoleT(colors.antHole, hit, ctx);
}

function drawBabyFireAnt(id, attack, hit, ctx = _ctx) {
    drawBabyAntT(id, colors.fireAnt, attack, hit, ctx);
}

function drawWorkerFireAnt(id, attack, hit, ctx = _ctx) {
    drawWorkerAntT(id, colors.fireAnt, attack, hit, ctx);
}

function drawSoldierFireAnt(id, attack, hit, ctx = _ctx) {
    drawSoldierAntT(id, colors.fireAnt, attack, hit, ctx);
}

function drawQueenFireAnt(id, attack, hit, ctx = _ctx) {
    drawQueenAntT(id, colors.fireAnt, attack, hit, ctx);
}

function drawFireAntHole(hit, ctx = _ctx) {
    drawAntHoleT(colors.fireAnt, hit, ctx);
}

function drawTermiteMound(hit, ctx = _ctx) {
    setStyle(ctx, mixColors(colors.scorpionBrown, "#FF0000", hit * .5), .4);
    ctx.beginPath();

    for (let i = 0; i < 7; i++) {
        const ang = TAU / 7 * i;
        const cs = Math.cos(ang) * .6;
        const sn = Math.sin(ang) * .6;

        ctx.moveTo(cs, sn);
        ctx.arc(cs, sn, .5, 0, TAU);
    }

    ctx.fill();
    ctx.stroke();

    drawAntHoleT(colors.termite, hit, ctx);
}

function drawBabyTermite(id, attk = false, hit = false, ctx = _ctx) {
    setStyle(ctx, mixColors(colors.termite, "#FF0000", hit * .5), .4);
    termiteHead(0, 0, 1, id, .005 + (attk * .0025), hit, ctx);
}

function drawWorkerTermite(id, attk = false, hit = false, ctx = _ctx) {
    setStyle(ctx, mixColors(colors.termite, "#FF0000", hit * .5), .4);

    ctx.beginPath();
    ctx.arc(-1.1, 0, .667, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    termiteHead(0, 0, 1, id, .005 + (attk * .003), hit, ctx);
}

function drawSoldierTermite(id, attk = false, hit = false, ctx = _ctx) {
    setStyle(ctx, mixColors(colors.termite, "#FF0000", hit * .5), .4);

    ctx.beginPath();
    ctx.arc(-1.1, 0, .667, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    drawWings(-.667, 0, 1.25, id, .002 + (attk * .0025), hit, ctx);
    termiteHead(0, 0, 1, id, .005 + (attk * .0035), hit, ctx);
}

function drawTermiteOvermind(id, attk = false, hit = false, ctx = _ctx) {
    ctx.save();
    ctx.strokeStyle = mixColors("#2A2A2A", "#FF0000", hit * .5);
    ctx.lineWidth = .2;
    const rotation = Math.sin(performance.now() * (.001 + attk * .005) + id / 4) * .05;
    ctx.beginPath();
    ctx.moveTo(0, -.3);
    ctx.rotate(-rotation);
    ctx.lineTo(1.14, -.2);
    ctx.closePath();
    ctx.stroke();
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.moveTo(0, .3);
    ctx.rotate(rotation);
    ctx.lineTo(1.14, .2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    setStyle(ctx, mixColors(colors.termite, "#FF0000", hit * .5), .2);
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}


function drawCentipedeSegment(color, hit = false, ctx = _ctx) {
    setStyle(ctx, mixColors(colors.stingerBlack, "#FF0000", hit * .5), .2);
    ctx.beginPath();
    ctx.arc(0, -.875, .375, 0, TAU);
    ctx.arc(0, .875, .375, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    setStyle(ctx, mixColors(color, "#FF0000", hit * .5), .2);
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawCentipedeHead(id, color, hit = false, ctx = _ctx) {
    drawCentipedeSegment(color, hit, ctx);

    const rotation = Math.sin(performance.now() * .005 + id / 6) * .1;

    setStyle(ctx, mixColors(colors.stingerBlack, "#FF0000", hit * .5), .2);
    ctx.beginPath();
    ctx.moveTo(.75, -.2);
    ctx.quadraticCurveTo(1.2, -.3 - rotation, 1.3, -.5 - rotation);
    ctx.moveTo(.75, .2);
    ctx.quadraticCurveTo(1.2, .3 + rotation, 1.3, .5 + rotation);
    ctx.stroke();
    ctx.closePath();
}

function drawDandelionCore(hit = false, ctx = _ctx) {
    setStyle(ctx, mixColors(colors.white, "#FF0000", hit * .5), .1);

    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawDandelionMissile(hit = false, ctx = _ctx) {
    setStyle(ctx, mixColors(colors.stingerBlack, "#FF0000", hit * .5), .6);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-2.1, 0);
    ctx.closePath();
    ctx.stroke();

    setStyle(ctx, mixColors(colors.white, "#FF0000", hit * .5), .2);

    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

const spongeColors = [
    colors.peach,
    colors.rosePink,
    colors.sandGold,
    colors.diepPentagon
];

const spongePtSize = TAU / 30;

function drawSponge(id, hit = false, ctx = _ctx) {
    ctx.save();
    setStyle(ctx, mixColors(spongeColors[id % 4], "#FF0000", hit * .5), .1);

    ctx.scale(1.1, 1.1);
    ctx.beginPath();
    for (let i = 0; i < 15; i++) {
        const angle = i * TAU / 15;
        const max = angle + spongePtSize;

        if (i === 0) {
            const min = angle - spongePtSize;
            ctx.moveTo(Math.cos(min) * .725, Math.sin(min) * .725);
        }

        ctx.quadraticCurveTo(Math.cos(angle), Math.sin(angle), Math.cos(max) * .725, Math.sin(max) * .725);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = ctx.strokeStyle;

    for (let i = 0; i < 5; i++) {
        const angle = i * TAU / 5;

        ctx.beginPath();
        ctx.arc(Math.cos(angle) * .5, Math.sin(angle) * .5, .15, 0, TAU);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * .25, Math.sin(angle) * .25, .1, 0, TAU);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * .1, Math.sin(angle) * .1, .05, 0, TAU);
        ctx.closePath();
        ctx.fill();
    }
    ctx.restore();
}

function drawBubbleMob(color, altColor, hit = false, ctx = _ctx) {
    setStyle(ctx, mixColors(color, "#FF0000", hit * .5), .085);
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.closePath();

    ctx.globalAlpha = .2;
    ctx.fill();

    ctx.globalAlpha = .8;
    ctx.stroke();

    ctx.fillStyle = mixColors(altColor, "#FF0000", hit * .5);
    ctx.beginPath();
    ctx.arc(.25, -.25, .25, 0, TAU);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 1;
}

function drawShellMob(hit = false, ctx = _ctx) {
    setStyle(ctx, mixColors(colors.peach, "#FF0000", hit * .5), .125);
    const fill = ctx.fillStyle;

    // Tail
    ctx.fillStyle = ctx.strokeStyle;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-.95, -.6);
    ctx.quadraticCurveTo(-.85, 0, -.95, .6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Body
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(.3, -.95);
    ctx.quadraticCurveTo(1.5, 0, .3, .95);
    ctx.lineTo(-.8, .3);
    ctx.quadraticCurveTo(-1, 0, -.8, -.3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Lines
    ctx.beginPath();
    ctx.moveTo(-.6, -.15);
    ctx.lineTo(.3, -.7);
    ctx.moveTo(-.4, -.085);
    ctx.lineTo(.4, -.3);
    ctx.moveTo(-.4, .085);
    ctx.lineTo(.4, .3);
    ctx.moveTo(-.6, .15);
    ctx.lineTo(.3, .7);
    ctx.stroke();
    ctx.closePath();
}

export class StarfishData {
    constructor() {
        this.legs = [1, 1, 1, 1, 1];
        this.legGoals = [1, 1, 1, 1, 1];
        this.livingCount = 5;
    }

    update(health) {
        let realLegCount = (health / .2 + .5) | 0;

        if (realLegCount > this.livingCount) {
            this.revive();
        }

        if (realLegCount < this.livingCount) {
            this.kill();
        }

        for (let i = 0; i < this.legs.length; i++) {
            if (this.legs[i] !== this.legGoals[i]) {
                this.legs[i] += (this.legGoals[i] - this.legs[i]) / 10;
            }
        }
    }

    revive() {
        if (this.livingCount === 5) {
            return;
        }

        const indexes = [0, 1, 2, 3, 4].sort(() => Math.random() - .5);

        for (let i = 0; i < indexes.length; i++) {
            if (this.legGoals[indexes[i]] === 0) {
                this.legGoals[indexes[i]] = 1;
                this.livingCount++;
                return;
            }
        }
    }

    kill() {
        if (this.livingCount === 0) {
            return;
        }

        const indexes = [0, 1, 2, 3, 4].sort(() => Math.random() - .5);

        for (let i = 0; i < indexes.length; i++) {
            if (this.legGoals[indexes[i]] === 1) {
                this.legGoals[indexes[i]] = 0;
                this.livingCount--;
                return;
            }
        }
    }
}

function drawStarfishRender(hit = false, ctx = _ctx) {
    setStyle(ctx, mixColors(colors.starfish, "#FF0000", hit * .5), .125);

    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const angle = TAU / 5 * i;
        const dist = 1.6;

        if (i === 0) {
            ctx.moveTo(Math.cos(angle - TAU / 10 * 1.8) * 1.6, Math.sin(angle - TAU / 10 * 1.8) * 1.6);
        }

        ctx.quadraticCurveTo(Math.cos(angle - TAU / 10) * .4, Math.sin(angle - TAU / 10) * .4, Math.cos(angle) * dist + Math.cos(angle - Math.PI / 2) * .2, Math.sin(angle) * dist + Math.sin(angle - Math.PI / 2) * .2);
        ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, .2, angle - Math.PI / 2, angle + Math.PI / 2);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = mixColors(ctx.fillStyle, colors.white, .3);
    for (let i = 0; i < 5; i++) {
        const angle = TAU / 5 * i;

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        ctx.beginPath();
        ctx.arc(cos * .4, sin * .4, .15, 0, TAU);
        ctx.moveTo(cos * .9, sin * .9);
        ctx.arc(cos * .9, sin * .9, .125, 0, TAU);
        ctx.moveTo(cos * 1.4, sin * 1.4);
        ctx.arc(cos * 1.4, sin * 1.4, .1125, 0, TAU);
        ctx.fill();
        ctx.closePath();
    }
}

/**
 * @param {boolean} hit
 * @param {CanvasRenderingContext2D} ctx 
 * @param {StarfishData} data
 */
function drawLivingStarfish(hit = false, ctx = _ctx, data) {
    setStyle(ctx, mixColors(colors.starfish, "#FF0000", hit * .5), .125);

    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const angle = TAU / 5 * i;
        const dist = 1 + .6 * data.legs[i];

        if (i === 0) {
            const otherDist = 1 + .6 * data.legs[4];
            const k = 1.675 + .125 * data.legs[4];
            ctx.moveTo(Math.cos(angle - TAU / 10 * k) * otherDist, Math.sin(angle - TAU / 10 * k) * otherDist);
        }

        ctx.quadraticCurveTo(Math.cos(angle - TAU / 10) * .4, Math.sin(angle - TAU / 10) * .4, Math.cos(angle) * dist + Math.cos(angle - Math.PI / 2) * .2, Math.sin(angle) * dist + Math.sin(angle - Math.PI / 2) * .2);
        ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, .2, angle - Math.PI / 2, angle + Math.PI / 2);
    }
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = mixColors(ctx.fillStyle, colors.white, .3);
    for (let i = 0; i < 5; i++) {
        const angle = TAU / 5 * i;
        const alive = data.legs[i] > .5;

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        ctx.beginPath();
        ctx.arc(cos * .4, sin * .4, .15, 0, TAU);
        ctx.moveTo(cos * .9, sin * .9);
        ctx.arc(cos * .9, sin * .9, .125, 0, TAU);
        if (alive) {
            ctx.moveTo(cos * 1.4, sin * 1.4);
            ctx.arc(cos * 1.4, sin * 1.4, .1125, 0, TAU);
        }
        ctx.fill();
        ctx.closePath();
    }
}

function drawLeechRender(ctx = _ctx) {
    const fill = colors.lighterBlack;
    const stroke = mixColors(fill, "#000000", .2);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.strokeStyle = stroke;
    ctx.lineWidth = .125;
    ctx.beginPath();
    ctx.moveTo(.5, -1);
    ctx.quadraticCurveTo(.42, -1.125, .5, -1.25);
    ctx.moveTo(.7, -1);
    ctx.quadraticCurveTo(.8, -1.125, .7, -1.25);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(.6, -.85);
    ctx.quadraticCurveTo(.4, .3, -.4, .9);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = .5;
    ctx.stroke();
    ctx.strokeStyle = fill;
    ctx.lineWidth = .3;
    ctx.stroke();
}

/**
 * 
 * @param {boolean} h 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {{x:number,y:number}[]} bodies 
 */
function drawLeechLive(h = false, ctx = _ctx, bodies = [], r, a = false, id, friendly = false) {
    const fill = mixColors(friendly ? colors.playerYellow : colors.lighterBlack, "#FF0000", .5 * h);
    const stroke = mixColors(fill, "#000000", .2);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const rotSpd = a ? .0075 : .0025;
    const rotation = Math.sin(performance.now() * rotSpd + id / 4) * .075 - Math.PI / 10;

    ctx.strokeStyle = stroke;
    ctx.lineWidth = .3;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, -.8);
    ctx.rotate(-rotation);
    ctx.quadraticCurveTo(1.15, -1, 1.3, -.8);
    ctx.stroke();
    ctx.closePath();

    ctx.rotate(rotation);

    ctx.beginPath();
    ctx.moveTo(0, .8);
    ctx.rotate(rotation);
    ctx.quadraticCurveTo(1.15, 1, 1.3, .8);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(0, 0);

    ctx.rotate(-r);
    bodies.forEach(body => {
        ctx.lineTo(body.x, body.y);
    });
    ctx.rotate(r);

    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.strokeStyle = fill;
    ctx.lineWidth = 1.5;
    ctx.stroke();
}

function drawFlyWings(x, y, s, id, rotSpd, hit = false, ctx = _ctx) {
    const rotation = Math.sin(performance.now() * rotSpd + id / 5) * .3 + Math.PI / 10;

    ctx.save();
    ctx.globalAlpha = .5;
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.fillStyle = mixColors("#9FA0A0", "#FF0000", hit * .5);

    ctx.beginPath();
    ctx.rotate(rotation);
    ctx.moveTo(0, -.25);
    ctx.ellipse(-.55, -.25, .675, .4, 0, 0, TAU);
    ctx.rotate(-rotation * 2);
    ctx.moveTo(0, .52);
    ctx.ellipse(-.55, .25, .675, .4, 0, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawFly(id, attack = false, hit = false, ctx = _ctx) {
    setStyle(ctx, mixColors(colors.ants, "#FF0000", hit * .5), .2);
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    drawFlyWings(-.25, 0, 1.25, id, .0025 + (attack * .0125), hit, ctx);
}

function drawMoth(id, attack = false, hit = false, ctx = _ctx) {
    setStyle(ctx, mixColors(colors.spider, "#FF0000", hit * .5), .2);
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    drawFlyWings(-.25, 0, 1.25, id, .0025 + (attack * .0125), hit, ctx);

    const rotation = 1 + Math.sin(performance.now() * .0025 * (1 + attack * 1.5) + id * .2) * .1;

    setStyle(ctx, mixColors(colors.stingerBlack, "#FF0000", hit * .5), .15);
    ctx.beginPath();
    ctx.moveTo(.75, -.3);
    ctx.quadraticCurveTo(1.3, -.35, 1.45, -.65 * rotation);
    ctx.moveTo(.75, .3);
    ctx.quadraticCurveTo(1.3, .35, 1.45, .65 * rotation);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(1.45, -.65 * rotation, .2, 0, TAU);
    ctx.arc(1.45, .65 * rotation, .2, 0, TAU);
    ctx.closePath();
    ctx.fill();
}

function drawMaggot(hit = false, ctx = _ctx) {
    setStyle(ctx, mixColors(colors.peach, "#FF0000", hit * .5), .2);
    ctx.beginPath();
    ctx.arc(-.4, .2, .25, 0, TAU);
    ctx.arc(-.4, -.2, .25, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    setStyle(ctx, mixColors(colors.cumWhite, "#FF0000", hit * .5), .2);
    ctx.beginPath();
    ctx.ellipse(0, 0, 1, .7, 0, Math.PI * 3 / 4, Math.PI * 5 / 4, true);
    ctx.quadraticCurveTo(0, -.2, 0, 0);
    ctx.quadraticCurveTo(0, .2, -.6, .45);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, .45);
    ctx.quadraticCurveTo(.5, 0, 0, -.45);
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = ctx.strokeStyle;
    ctx.beginPath();
    ctx.arc(.65, .15, .15, 0, TAU);
    ctx.arc(.65, -.15, .15, 0, TAU);
    ctx.closePath();
    ctx.fill();
}

function drawFirefly(id, hit = false, ctx = _ctx) {
    setStyle(ctx, mixColors(colors.fireFlyLight, "#FF0000", hit * .5), .125);
    ctx.beginPath();
    ctx.ellipse(-1 * 1.25, 0, 1 * 1.25, .75 * 1.25, 0, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    setStyle(ctx, mixColors(colors.fireFlyLight, "#FF0000", hit * .5), .125);
    ctx.beginPath();
    ctx.arc(-1 * 1.25, 0, .5 * 1.25, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    drawFlyWings(-.25 * 1.25, 0, 1.25 * 1.25, id, .0025, hit, ctx);

    setStyle(ctx, mixColors(colors.ants, "#FF0000", hit * .5), .2);
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawBumbleBee(id, hit = false, ctx = _ctx) {
    setStyle(ctx, mixColors(colors.honeyGold, "#FF0000", hit * .5), .2);
    ctx.beginPath();
    ctx.ellipse(0, 0, 1, .8, 0, 0, TAU);
    ctx.closePath();
    ctx.fill();

    ctx.save();
    ctx.clip();

    ctx.beginPath();
    ctx.rect(-1, -1, .334, 2);
    ctx.rect(-.334, -1, .334, 2);
    ctx.rect(.334, -1, .334, 2);
    ctx.fillStyle = mixColors(colors.stingerBlack, "#FF0000", hit * .5);
    ctx.fill();

    ctx.restore();

    ctx.beginPath();
    ctx.ellipse(0, 0, 1, .8, 0, 0, TAU);
    ctx.closePath();
    ctx.stroke();

    const rotation = 1 + Math.sin(performance.now() / 334 + id * .2) * .1;

    setStyle(ctx, mixColors(colors.stingerBlack, "#FF0000", hit * .5), .2);
    ctx.beginPath();
    ctx.moveTo(.85, -.15);
    ctx.quadraticCurveTo(1.25, -.2, 1.4, -.45 * rotation);
    ctx.moveTo(.85, .15);
    ctx.quadraticCurveTo(1.25, .2, 1.4, .45 * rotation);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(1.4, -.45 * rotation, .15, 0, TAU);
    ctx.arc(1.4, .45 * rotation, .15, 0, TAU);
    ctx.closePath();
    ctx.fill();
}

function drawSquareMob(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.diepSquare, "#FF0000", hit * .5), .15);
    polygon(ctx, 4, .925, 0);
    ctx.fill();
    ctx.stroke();
}

function drawTriangleMob(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.diepTriangle, "#FF0000", hit * .5), .15);
    polygon(ctx, 3, .925, 0);
    ctx.fill();
    ctx.stroke();
}

function drawPentagonMob(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.diepPentagon, "#FF0000", hit * .5), .15);
    polygon(ctx, 5, .925, 0);
    ctx.fill();
    ctx.stroke();
}

function drawHellBeetle(id, hit = false, ctx = _ctx, attack = false) {
    const pincerRot = Math.sin(performance.now() * (.0085 + .0085 * attack) + id / 4) * .15 + Math.PI / 20;

    setStyle(ctx, mixColors(mixColors(colors.stingerBlack, colors.hellMobColor, .25), "#FF0000", hit * .5), .1);
    ctx.save();
    ctx.translate(1, -.2);
    ctx.rotate(pincerRot);
    ctx.beginPath();
    ctx.lineTo(-.2805, -.1445);
    ctx.quadraticCurveTo(.306, -.374, .6885, -.085);
    ctx.quadraticCurveTo(.7905, -.0085, .697, .0765);
    ctx.quadraticCurveTo(.3655, 0, -.2125, .204);
    ctx.closePath();
    ctx.fill();
    ctx.rotate(-pincerRot);
    ctx.translate(0, .4);
    ctx.rotate(-pincerRot);
    ctx.beginPath();
    ctx.lineTo(-.2805, .1445);
    ctx.quadraticCurveTo(.306, .374, .6885, .085);
    ctx.quadraticCurveTo(.7905, .0085, .697, -.0765);
    ctx.quadraticCurveTo(.3655, 0, -.2125, -.204);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    drawBeetle(id, colors.hellMobColor, hit, ctx, attack);
}

function drawHellSpider(id, hit = false, ctx = _ctx, attack = false) {
    const pincerRot = Math.sin(performance.now() * (.0085 + .0085 * attack) + id / 4) * .15 + Math.PI / 20;

    setStyle(ctx, mixColors(mixColors(colors.stingerBlack, colors.hellMobColor, .25), "#FF0000", hit * .5), .1);
    ctx.save();
    ctx.translate(.7, -.2);
    ctx.rotate(pincerRot);
    ctx.beginPath();
    ctx.lineTo(-.2805, -.1445);
    ctx.quadraticCurveTo(.306, -.374, .6885, -.085);
    ctx.quadraticCurveTo(.7905, -.0085, .697, .0765);
    ctx.quadraticCurveTo(.3655, 0, -.2125, .204);
    ctx.closePath();
    ctx.fill();
    ctx.rotate(-pincerRot);
    ctx.translate(0, .4);
    ctx.rotate(-pincerRot);
    ctx.beginPath();
    ctx.lineTo(-.2805, .1445);
    ctx.quadraticCurveTo(.306, .374, .6885, .085);
    ctx.quadraticCurveTo(.7905, .0085, .697, -.0765);
    ctx.quadraticCurveTo(.3655, 0, -.2125, -.204);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Legs
    ctx.strokeStyle = mixColors(colors.stingerBlack, "#FF0000", hit * .5);
    ctx.lineWidth = .4;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
        const rot = i * .52 - .79 + Math.cos(performance.now() * (.0025 + (attack * .0125)) + i + id / 3) * .2;

        ctx.rotate(rot);
        ctx.moveTo(0, -2.2);
        ctx.quadraticCurveTo(.2, -1, 0, 0);
        ctx.quadraticCurveTo(-.2, 1, 0, 2.2);
        ctx.rotate(-rot);
    }
    ctx.stroke();
    ctx.closePath();

    // Body
    setStyle(ctx, mixColors(colors.hellMobColor, "#FF0000", hit * .5), .2);
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawHellYellowjacket(id, hit = false, ctx = _ctx, attack = false) {
    const myColor = mixColors(colors.hellMobColor, "#FF0000", hit * .5);
    const myAltColor = mixColors(colors.stingerBlack, "#FF0000", hit * .5);
    const stingerRotation = attack ? Math.sin(performance.now() / 60 + id * .1) * .03 : (performance.now() + id * 240) % (9000 + id * 8) > (8500 + id * 4) ? Math.sin(performance.now() / 60 + id * .1) * .025 : 0;

    setStyle(ctx, myColor, .1);
    ctx.beginPath();
    ctx.moveTo(-1.55, stingerRotation);
    ctx.lineTo(-.25, -.4);
    ctx.lineTo(-.25, .4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    setStyle(ctx, myColor, .1);
    ctx.beginPath();
    ctx.ellipse(0, 0, 1, .7, 0, 0, TAU);
    ctx.closePath();
    ctx.fill();

    ctx.save();
    ctx.clip();

    ctx.beginPath();
    ctx.rect(-1, -1, .5, 2);
    ctx.rect(.1, -1, .4, 2);
    ctx.fillStyle = myAltColor;
    ctx.fill();

    ctx.restore();

    ctx.beginPath();
    ctx.ellipse(0, 0, 1, .667, 0, 0, TAU);
    ctx.closePath();
    ctx.stroke();

    setStyle(ctx, myAltColor, .1);

    ctx.beginPath();
    ctx.moveTo(.85, .16);
    ctx.quadraticCurveTo(1.36, .18, 1.68, .49);
    ctx.quadraticCurveTo(1.26, .3, .85, .16);
    ctx.moveTo(.85, -.16);
    ctx.quadraticCurveTo(1.36, -.18, 1.68, -.49);
    ctx.quadraticCurveTo(1.26, -.3, .85, -.16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Wings
    const wingRotation = Math.sin(performance.now() * (.0025 + (attack * .0125)) + id / 5) * .3 + Math.PI / 10;

    ctx.save();
    ctx.globalAlpha = .5;
    ctx.translate(-.25, 0);
    ctx.scale(1.25, 1.25);
    ctx.fillStyle = mixColors("#9FA0A0", "#FF0000", hit * .5);

    ctx.beginPath();
    ctx.rotate(wingRotation);
    ctx.moveTo(-.2, -.3);
    ctx.ellipse(-.55, -.25, .7, .4, 0, 0, TAU);
    ctx.rotate(-wingRotation * 2);
    ctx.moveTo(-.2, .3);
    ctx.ellipse(-.55, .25, .7, .4, 0, 0, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

const spiritColors = [
    colors.rockGray,
    colors.lighterBlack,
    colors.stingerBlack,
    mixColors(colors.ancient, colors.rockGray, .5),
    mixColors(colors.ancient, colors.lighterBlack, .5),
    mixColors(colors.ancient, colors.stingerBlack, .5),
    mixColors(colors.omega, colors.rockGray, .5),
    mixColors(colors.omega, colors.lighterBlack, .5),
    mixColors(colors.omega, colors.stingerBlack, .5),
    mixColors(colors.orange, colors.rockGray, .5),
    mixColors(colors.orange, colors.lighterBlack, .5),
    mixColors(colors.orange, colors.stingerBlack, .5),
    mixColors(colors.scorpionBrown, colors.rockGray, .5),
    mixColors(colors.scorpionBrown, colors.lighterBlack, .5),
    mixColors(colors.scorpionBrown, colors.stingerBlack, .5),
    mixColors(colors.irisPurple, colors.rockGray, .5),
    mixColors(colors.irisPurple, colors.lighterBlack, .5),
    mixColors(colors.irisPurple, colors.stingerBlack, .5),
]

const SpiritSpiral = new Path2D("m0 0c-.011-.0114.0151-.0218.0222-.0215.0405.0016.0498.0542.0385.0844-.0263.0703-.1173.0806-.1764.0487-.1042-.0562-.1155-.1969-.0563-.2896.0909-.1422.2899-.1543.4206-.0622.1841.1298.1967.3948.067.5671-.1727.2295-.5101.2423-.7277.0709-.2782-.2192-.2911-.6351-.0741-.9012.269-.33.7691-.3427 1.0868-.0767.3825.3203.3973.9056.0833 1.2781")
function drawSpirit(id, ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(spiritColors[id % spiritColors.length], "#ff0000", hit * .5), .2);

    ctx.save();

    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.globalAlpha = .5;
    ctx.fill();
    ctx.closePath();
    ctx.stroke(SpiritSpiral);
    ctx.rotate(Math.PI);
    ctx.stroke(SpiritSpiral);

    ctx.restore();
}

function drawStickbug(id, color, altColor, altColor2, attack, hit = false, ctx = _ctx) {
    setStyle(ctx, mixColors(altColor, "#ff0000", hit * .5), .2)

    // legs

    ctx.beginPath();

    for (let i = 0; i < 3; i++) {
        const legRot = Math.cos(performance.now() * (.0025 + (attack * .0125)) + i + id) * (i - .5) * .1;
        ctx.moveTo(-1, 0.5);
        ctx.rotate(legRot)
        ctx.quadraticCurveTo(-1.5, 1.6, -1.75, 1.7);
        ctx.rotate(-legRot)

        ctx.moveTo(-1, -0.5);
        ctx.rotate(legRot)
        ctx.quadraticCurveTo(-1.5, -1.6, -1.75, -1.7);
        ctx.rotate(-legRot)

        ctx.translate(1, 0);
    };

    ctx.stroke();
    ctx.closePath();

    ctx.translate(-3, 0);

    // head

    setStyle(ctx, mixColors(altColor2, "#ff0000", hit * .5), .2);

    ctx.beginPath();
    ctx.arc(1, 0, .6, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // body

    setStyle(ctx, mixColors(color, "#ff0000", hit * .5), .2);

    ctx.beginPath();
    ctx.moveTo(1.5, 0.75);
    ctx.quadraticCurveTo(.5, 0, 1.5, -0.75);
    ctx.quadraticCurveTo(.5, -1, -1, -0.75);
    ctx.quadraticCurveTo(-3.5, 0, -1, 0.75);
    ctx.quadraticCurveTo(.5, 1, 1.5, 0.75);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

function drawShrub(id, color, ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(color, "#ff0000", hit * .5), .125);

    for (let i = 9; i >= 7; i--) {
        polygon(ctx, i, 1 - (0.25 * (9 - i)), 0);
        ctx.fill();
        ctx.stroke();
    };

    for (let i = 0; i < 5; i++) {
        const angle = Math.sin(i * 10000 + id) * TAU;
        const radius = Math.sin(i * 1000 + id) * .02 + .2;
        const d = Math.sin(i * 10000 + id) * .7;
        ctx.fillStyle = mixColors(mixColors(color, "#000000", Math.sin(i * 1000 + id) * .2), "#ff0000", hit * .5)

        ctx.beginPath();
        ctx.arc(Math.cos(angle) * d, Math.sin(angle) * d, radius, 0, TAU);
        ctx.fill();
    };

}

const PumpkinPath = new Path2D("M.7247-.3319C.6942-.3316.6609-.3288.6245-.3232.1584-.2507 0 0 0 0S.1584.2507.6245.3232C1.0907.3956 1.0457 0 1.0457 0S1.0839-.3362.7247-.3319Z");
function drawPumpkin(color, altColor, ctx, hit) {
    setStyle(ctx, mixColors(color, "#ff0000", hit * .5), .125);

    for (let i = 0; i < 10; i++) {
        ctx.fill(PumpkinPath);
        ctx.stroke(PumpkinPath);
        ctx.rotate(TAU / 10);
    }

    setStyle(ctx, mixColors(altColor, "#ff0000", hit * .5), .1);
    ctx.beginPath();
    polygon(ctx, 7, .25, 0);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

function drawJackOLantern(color, altColor, ctx, hit) {
    // Fire animation
    ctx.save();
    ctx.globalAlpha = .5;
    ctx.fillStyle = mixColors(mixColors(color, "#000000", Math.sin(performance.now()) * .5 + .5), "#ff0000", hit * .5);
    ctx.beginPath();
    for (let i = 0; i < 14; i++) {
        let a = i * TAU / 14,
            d = .75 + Math.sin(performance.now() + i * Math.cos(performance.now() / 1000) * .5);

        if (i === 0) {
            ctx.moveTo(Math.cos(a) * d, Math.sin(a) * d);
        } else {
            ctx.lineTo(Math.cos(a) * d, Math.sin(a) * d);
        }
    }

    ctx.closePath();
    ctx.fill();
    ctx.restore();

    drawPumpkin(color, altColor, ctx, hit);
}

const crabBodyColors = [
    colors.crabBodyOrange,
    colors.diepTriangle,
    colors.antHole
]

function drawCrab(id, attack, ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.crabLimbBrown, "#ff0000", hit * .5), .2);

    for (let i = 0; i < 4; i++) {

        ctx.lineWidth = .25;

        const legRot = Math.cos(performance.now() * (.0025 + (attack * .0125)) + id + i) * -.4;
        const legAng = TAU / 14 * (i - 1.5);

        ctx.beginPath();
        ctx.rotate(legAng);
        ctx.moveTo(0, .75);
        ctx.rotate(legRot);
        ctx.lineTo(0, 1.5);
        ctx.lineTo(0, 1.825);
        ctx.rotate(-legRot - legAng);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.rotate(legAng);
        ctx.moveTo(0, -.75);
        ctx.rotate(-legRot);
        ctx.lineTo(0, -1.5);
        ctx.lineTo(0, -1.825);
        ctx.rotate(legRot - legAng);
        ctx.stroke();
        ctx.closePath();
    }

    // claws

    const clawRot = Math.cos(performance.now() * (.0025 + (attack * .0125)) + id) * -.4;

    ctx.translate(.75, -.525);
    ctx.rotate(clawRot);
    ctx.scale(.375, .375);

    ctx.translate(.5, -.5);

    ctx.beginPath();
    ctx.moveTo(-.96, -.31);
    ctx.bezierCurveTo(.5, -.91, .86, .23, 1, .54);
    ctx.lineTo(.4, .09);
    ctx.lineTo(.56, .75);
    ctx.bezierCurveTo(.1, .33, -.38, .02, -1, .22);
    ctx.bezierCurveTo(-.95, .05, -.86, -.12, -.96, -.31);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.translate(-.5, .5);

    ctx.scale(1 / .375, 1 / .375);
    ctx.rotate(-clawRot);
    ctx.translate(-.75, .525);

    ctx.translate(.75, .525);
    ctx.rotate(-clawRot);
    ctx.scale(.375, .375);

    ctx.translate(.5, .5);

    ctx.beginPath();
    ctx.moveTo(-.96, .31);
    ctx.bezierCurveTo(.5, .91, .86, -.23, 1, -.54);
    ctx.lineTo(.4, -.09);
    ctx.lineTo(.56, -.75);
    ctx.bezierCurveTo(.1, -.33, -.38, -.02, -1, -.22);
    ctx.bezierCurveTo(-.95, -.05, -.86, .12, -.96, .31);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.translate(-.5, -.5);

    ctx.scale(1 / .375, 1 / .375);
    ctx.rotate(clawRot);
    ctx.translate(-.75, -.525);

    setStyle(ctx, mixColors(crabBodyColors[id * 1000 % crabBodyColors.length], "#ff0000", hit * .5), .2);

    ctx.beginPath();
    ctx.ellipse(0, 0, .825, 1.125, 0, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(.375, .375);
    ctx.quadraticCurveTo(0, .1625, -.375, .375);
    ctx.moveTo(.375, -.375);
    ctx.quadraticCurveTo(0, -.1625, -.375, -.375);
    ctx.stroke();
    ctx.closePath();
}

function drawDiepTank(ctx = _ctx, hit = false) {
    setStyle(ctx, mixColors(colors.rockGray, "#ff0000", hit * .5), .2);
    ctx.fillRect(0, -.4, 1.8, .8);
    ctx.strokeRect(0, -.4, 1.8, .8);

    setStyle(ctx, mixColors(colors.diepBlue, "#ff0000", hit * .5), .2);

    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.fill();
    ctx.stroke();
}

export function drawMob(id, index, rarity, hit = false, ctx = _ctx, attack = false, friend = false, rot = 0, extra = undefined) {
    switch (index) {
        case 0:
            drawLadybug(id, colors.ladybugRed, hit, ctx);
            break;
        case 1:
            drawRock(id, rarity, hit, ctx);
            break;
        case 2:
            drawBee(id, hit, ctx);
            break;
        case 3:
            drawSpider(id, attack, hit, ctx);
            break;
        case 4:
            drawBeetle(id, friend ? colors.playerYellow : colors.beetlePurple, hit, ctx, attack);
            break;
        case 5:
            drawLeafbug(id, attack, hit, ctx);
            break;
        case 6:
            drawRoach(hit, ctx);
            break;
        case 7:
            drawHornet(id, friend ? colors.playerYellow : colors.hornet, colors.stingerBlack, hit, ctx);
            break;
        case 8:
            drawMantis(id, attack, hit, ctx);
            break;
        case 9:
            drawPupa(hit, ctx);
            break;
        case 10:
            drawSandstorm(id, friend ? colors.honeyGold : colors.sand, attack, hit, ctx);
            break;
        case 11:
            drawScorpion(id, hit, ctx);
            break;
        case 12:
            drawDemon(id, hit, ctx, attack);
            break;
        case 13:
            drawJellyfish(id, attack, hit, ctx);
            break;
        case 14:
            drawCactusMob(rarity, hit, ctx);
            break;
        case 15:
            drawBabyAnt(id, attack, hit, ctx);
            break;
        case 16:
            drawWorkerAnt(id, attack, hit, ctx);
            break;
        case 17:
            drawSoldierAnt(id, attack, hit, ctx, friend);
            break;
        case 18:
            drawQueenAnt(id, attack, hit, ctx);
            break;
        case 19:
            drawAntHole(hit, ctx);
            break;
        case 20:
            drawBabyFireAnt(id, attack, hit, ctx);
            break;
        case 21:
            drawWorkerFireAnt(id, attack, hit, ctx);
            break;
        case 22:
            drawSoldierFireAnt(id, attack, hit, ctx);
            break;
        case 23:
            drawQueenFireAnt(id, attack, hit, ctx);
            break;
        case 24:
            drawFireAntHole(hit, ctx);
            break;
        case 25:
            drawBabyTermite(id, attack, hit, ctx);
            break;
        case 26:
            drawWorkerTermite(id, attack, hit, ctx);
            break;
        case 27:
            drawSoldierTermite(id, attack, hit, ctx);
            break;
        case 28:
            drawTermiteOvermind(id, attack, hit, ctx);
            break;
        case 29:
            drawTermiteMound(hit, ctx);
            break;
        case 30: // Ant Egg
        case 31: // Queen Ant Egg
            basicPetal(ctx, hit, colors.peach);
            break;
        case 32: // Fire Ant Egg
        case 33: // Queen Fire Ant Egg
            basicPetal(ctx, hit, mixColors(colors.peach, colors.fireAnt, .2));
            break;
        case 34: // Termite Ant Egg
            basicPetal(ctx, hit, mixColors(colors.peach, colors.termite, .5));
            break;
        case 35:
            drawLadybug(id, colors.evilLadybugRed, hit, ctx);
            break;
        case 36:
            drawLadybug(id, colors.shinyLadybugGold, hit, ctx);
            break;
        case 37:
            drawLadybug(id, colors.lightningTeal, hit, ctx);
            break;
        case 38:
            drawCentipedeHead(id, colors.peaGreen, hit, ctx);
            break;
        case 39:
            drawCentipedeSegment(colors.peaGreen, hit, ctx);
            break;
        case 40:
            drawCentipedeHead(id, colors.sand, hit, ctx);
            break;
        case 41:
            drawCentipedeSegment(colors.sand, hit, ctx);
            break;
        case 42:
            drawCentipedeHead(id, colors.irisPurple, hit, ctx);
            break;
        case 43:
            drawCentipedeSegment(colors.irisPurple, hit, ctx);
            break;
        case 44:
            drawDandelionCore(hit, ctx);
            break;
        case 45:
            drawSponge(id, hit, ctx);
            break;
        case 46:
            drawBubbleMob(colors.white, colors.bubbleGrey, hit, ctx);
            break;
        case 47:
            drawShellMob(hit, ctx);
            break;
        case 48:
            drawLivingStarfish(hit, ctx, extra);
            break;
        case 49:
            drawLeechLive(hit, ctx, extra, rot, attack, id, friend);
            break;
        case 50:
            drawMaggot(hit, ctx);
            break;
        case 51:
            drawFirefly(id, hit, ctx);
            break;
        case 52:
            drawBumbleBee(id, hit, ctx);
            break;
        case 53:
            drawMoth(id, attack, hit, ctx);
            break;
        case 54:
            drawFly(id, attack, hit, ctx);
            break;
        case 55:
            drawSquareMob(ctx, hit);
            break;
        case 56:
            drawTriangleMob(ctx, hit);
            break;
        case 57:
            drawPentagonMob(ctx, hit);
            break;
        case 58:
            drawHellBeetle(id, hit, ctx, attack);
            break;
        case 59:
            drawHellSpider(id, hit, ctx, attack);
            break;
        case 60:
            drawHellYellowjacket(id, hit, ctx, attack);
            break;
        case 61: // Termite Ant Egg Poop
            basicPetal(ctx, hit, mixColors(colors.peach, colors.termite, .5));
            break;
        case 62:
            drawSpirit(id, ctx, hit)
            break;
        case 63:
            drawHornet(id, colors.wasp, colors.waspDark, hit, ctx);
            break;
        case 64:
            drawStickbug(id, colors.peach, colors.spider, colors.uncommon, attack, hit, ctx);
            break;
        case 65:
            drawShrub(id, colors.shrubGreen, ctx, hit)
            break;
        case 66:
            drawCentipedeHead(id, colors.hellMobColor, hit, ctx);
            break;
        case 67:
            drawCentipedeSegment(colors.hellMobColor, hit, ctx);
            break;
        case 68: // Wilt Head
        case 69: // Wilt Segment
            drawShrub(id, mixColors(friend ? colors.playerYellow : colors.rockGray, "#000000", .25 + Math.sin(id * 1000) * .125), ctx, hit);
            break;
        case 70:
            drawPumpkin(colors.ancient, colors.cactusGreen, ctx, hit);
            break;
        case 71:
            drawJackOLantern(colors.ancient, colors.cactusGreen, ctx, hit);
            break;
        case 72:
            drawCrab(id, attack, ctx, hit)
            break;
        case 73:
            drawDiepTank(ctx, hit);
            break;
    }
}

export function drawUIMob(index, rarity, ctx = _ctx) {
    switch (index) {
        case 49:
            drawStarfishRender(false, ctx);
            break;
        case 50:
            drawLeechRender(ctx);
            break;
        default:
            drawMob(0, index, rarity, false, ctx, false, false, undefined);
            break;
    }
}

function createPetalTooltip(index, rarityIndex) {
    /** @type {PetalConfig} */
    const petal = state.petalConfigs[index];
    const tier = petal.tiers[rarityIndex];

    let width = 350,
        height = 60 + drawWrappedText(petal.description, -10000, -10000, 12.5, width - 20) + 30;

    height += 17.5 * (
        (tier.health > 0) +
        (tier.damage > 0) +
        (tier.extraHealth !== 0) +
        (tier.constantHeal > 0) +
        (tier.count > 1) +
        (tier.damageReduction > 0) +
        (tier.speedMultiplier !== 1) +
        (tier.extraSize !== 0) +
        (tier.extraRadians > 0) +
        (tier.healing > 0) +
        (petal.enemySpeedDebuff !== undefined) +
        (tier.poison !== undefined) +
        (tier.extraRange > 0) +
        (tier.spawnable !== undefined) +
        (tier.extraVision > 0) +
        ((tier.pentagramAbility !== undefined) * 4) +
        (tier.lightning !== undefined) +
        (tier.extraPickupRange > 0) +
        (tier.healSpit > 0) +
        (tier.damageReflection > 0) +
        (tier.density !== 1) +
        ((tier.deathDefying > 0) * 2) +
        (tier.absorbsDamage !== undefined) +
        (tier.shield > 0) +
        (tier.boost !== undefined) +
        (tier.healBack > 0) +
        (tier.lightning?.charges > 1) +
        (petal.extraLighting > 0) +
        ((petal.extraDamage !== undefined) * 2)
    );

    const canvas = new OffscreenCanvas(width * 2, height * 2);
    const ctx = canvas.getContext("2d");

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.scale(2, 2);

    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, width / 20);
    ctx.globalAlpha = .334;
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    text(petal.name, 10, 10, 22.5, "#FFFFFF", ctx);
    text(state.tiers[rarityIndex].name, 10, 35, 15, state.tiers[rarityIndex].color, ctx);

    let timerString = petal.wearable ? "🎩" : (((petal.cooldown / 22.5 * 100) | 0) / 100) + "s ⟳";

    if (tier.count > 1) {
        timerString = tier.count + "x | " + timerString;
    }

    if (tier.spawnable?.timer > 0) {
        timerString += " + " + +tier.spawnable.timer.toFixed(2) + "s ⚡︎";
    }

    if (tier.boost !== undefined) {
        timerString += " + " + +tier.boost.delay.toFixed(2) + "s ⚡︎";
    }

    ctx.textAlign = "right";
    text(timerString, width - 10, 10, 17.5, "#FFFFFF", ctx);
    ctx.textAlign = "left";

    let newY = 80 + drawWrappedText(petal.description, 10, 60, 12.5, width - 20, "#FFFFFF", ctx);

    if (tier.health > 0) {
        text("Health: " + formatLargeNumber(+tier.health.toFixed(2)), 10, newY, 15, colors.common, ctx);
        newY += 17.5;
    }

    if (tier.damage > 0) {
        text("Damage: " + formatLargeNumber(+tier.damage.toFixed(2)), 10, newY, 15, mixColors(colors.legendary, "#FFFFFF", .2), ctx);
        newY += 17.5;
    }

    if (tier.extraHealth !== 0) {
        text("Extra Health: " + formatLargeNumber(+tier.extraHealth.toFixed(2)), 10, newY, 15, mixColors(colors.epic, "#FFFFFF", .2), ctx);
        newY += 17.5;
    }

    if (tier.constantHeal > 0) {
        let x = 10 + text("Constant Heal: " + formatLargeNumber(+tier.constantHeal.toFixed(2)), 10, newY, 15, mixColors(colors.common, "#FFFFFF", .2), ctx);

        if (petal.healWhenUnder < 1) {
            x += text(" (", x, newY, 15, colors.bubbleGrey, ctx);
            x += text("Under " + +(petal.healWhenUnder * 100).toFixed(2) + "% HP", x, newY, 15, colors.rosePink, ctx);
            text(")", x, newY, 15, colors.bubbleGrey, ctx);
        }

        newY += 17.5;
    }

    if (tier.damageReduction > 0) {
        text("Damage Reduction: -" + formatLargeNumber(+(tier.damageReduction * 100).toFixed(2)) + "%", 10, newY, 15, mixColors(colors.ultra, "#FFFFFF", .2), ctx);
        newY += 17.5;
    }

    if (tier.speedMultiplier !== 1) {
        text("Speed: " + (tier.speedMultiplier > 1 ? "+" : "") + +((tier.speedMultiplier - 1) * 100).toFixed(2) + "%", 10, newY, 15, mixColors(colors.mythic, "#FFFFFF", .2), ctx);
        newY += 17.5;
    }

    if (tier.extraSize !== 0) {
        text("Extra Size: " + (tier.extraSize > 0 ? "+" : "-") + +tier.extraSize.toFixed(2), 10, newY, 15, mixColors(colors.ancient, "#FFFFFF", .2), ctx);
        newY += 17.5;
    }

    if (tier.extraRadians > 0) {
        text("Radians: +" + +tier.extraRadians.toFixed(2), 10, newY, 15, mixColors(colors.super, "#FFFFFF", .2), ctx);
        newY += 17.5;
    }

    if (tier.healing > 0) {
        text("Heal: +" + formatLargeNumber(+tier.healing.toFixed(2)), 10, newY, 15, colors.rosePink, ctx);
        newY += 17.5;
    }

    if (petal.enemySpeedDebuff !== undefined) {
        text("Speed Debuff: -" + (+((1 - petal.enemySpeedDebuff.speedMultiplier) * 100).toFixed(2)) + "% for " + (petal.enemySpeedDebuff.duration / 22.5).toFixed(2) + "s", 10, newY, 15, colors.jellyfish, ctx);
        newY += 17.5;
    }

    if (tier.poison !== undefined) {
        text("Poison: " + formatLargeNumber(+tier.poison.damage.toFixed(2)) + "/s for " + (tier.poison.duration / 22.5).toFixed(2) + "s", 10, newY, 15, colors.irisPurple, ctx);
        newY += 17.5;
    }

    if (tier.extraRange > 0) {
        text("Range: +" + +tier.extraRange.toFixed(2), 10, newY, 15, colors.orange, ctx);
        newY += 17.5;
    }

    if (tier.spawnable !== undefined) {
        let x = 10 + text("Spawns: ", 10, newY, 15, colors.bubbleGrey, ctx);
        x += text(state.mobConfigs[tier.spawnable.index].name, x, newY, 15, colors.peaGreen, ctx);
        x += text(" (", x, newY, 15, colors.bubbleGrey, ctx);
        x += text(state.tiers[tier.spawnable.rarity].name, x, newY, 15, state.tiers[tier.spawnable.rarity].color, ctx);
        text(")", x, newY, 15, colors.bubbleGrey, ctx);

        newY += 17.5;
    }

    if (tier.extraVision > 0) {
        text("Vision: +" + +tier.extraVision.toFixed(2), 10, newY, 15, colors.orange, ctx);
        newY += 17.5;
    }

    if (tier.pentagramAbility !== undefined) {
        text("Spell: " + +(tier.pentagramAbility.cooldown / 22.5).toFixed(2) + "s ⚡︎, " + formatLargeNumber(+tier.pentagramAbility.range.toFixed(2)) + " range", 10, newY, 15, colors.evilLadybugRed, ctx);
        newY += 17.5;

        text("- Damage: " + formatLargeNumber(+tier.pentagramAbility.damage.toFixed(2)), 20, newY, 15, mixColors(colors.legendary, "#FFFFFF", .2), ctx);
        newY += 17.5;

        text("- Poison Inflicted: " + formatLargeNumber(+tier.pentagramAbility.poison.damage.toFixed(2)) + "/s for " + +tier.pentagramAbility.poison.duration.toFixed(2) + "s", 20, newY, 15, colors.irisPurple, ctx);
        newY += 17.5;

        text("- Speed Debuff: " + +((1 - tier.pentagramAbility.speedDebuff.multiplier) * 100).toFixed(2) + "% for " + +tier.pentagramAbility.speedDebuff.duration.toFixed(2) + "s", 20, newY, 15, colors.jellyfish, ctx);
        newY += 17.5;
    }

    if (tier.lightning !== undefined) {
        let x = 10 + text("Lightning: ", 10, newY, 15, colors.lightningTeal, ctx);
        x += text(tier.lightning.bounces + "x, ", x, newY, 15, mixColors(colors.team1, "#FFFFFF", .4), ctx);
        x += text(formatLargeNumber(+tier.lightning.damage.toFixed(2)) + " dmg, ", x, newY, 15, mixColors(colors.team2, "#FFFFFF", .4), ctx);
        x += text(formatLargeNumber(+tier.lightning.range.toFixed(2)) + " range", x, newY, 15, mixColors(colors.playerYellow, "#FFFFFF", .4), ctx);

        newY += 17.5;
    }

    if (tier.lightning?.charges > 1) {
        text("Charges: " + tier.lightning.charges, 10, newY, 15, mixColors(colors.lightningTeal, "#FFFFFF", .4), ctx);
        newY += 17.5;
    }

    if (tier.extraPickupRange > 0) {
        text("Pickup Range: +" + +tier.extraPickupRange.toFixed(2), 10, newY, 15, mixColors(colors.rare, "#FFFFFF", .35), ctx);
        newY += 17.5;
    }

    if (tier.healSpit > 0) {
        text("Team Heal: +" + formatLargeNumber(+tier.healSpit.toFixed(2)) + "/nearby teammate", 10, newY, 15, colors.rosePink, ctx);
        newY += 17.5;
    }

    if (tier.damageReflection > 0) {
        text("Damage Reflection: " + +(tier.damageReflection * 100).toFixed(2) + "%", 10, newY, 15, mixColors(colors.legendary, "#FFFFFF", .2), ctx);
        newY += 17.5;
    }

    if (tier.density !== 1) {
        text("Density: " + +tier.density.toFixed(2), 10, newY, 15, mixColors(colors.epic, "#FFFFFF", .2), ctx);
        newY += 17.5;
    }

    if (tier.deathDefying > 0) {
        text("Resurrection Health: " + +(tier.deathDefying * 100).toFixed(2) + "%", 10, newY, 15, mixColors(colors.mythic, "#FFFFFF", .2), ctx);
        text("Resurrection Immunity: " + +((1500 + rarityIndex * 250) / 1000).toFixed(2) + "s", 10, newY + 17.5, 15, mixColors(colors.super, "#FFFFFF", .2), ctx);
        newY += 17.5 * 2;
    }

    if (tier.absorbsDamage !== undefined) {
        let x = 10 + text("Absorption: ", 10, newY, 15, mixColors(colors.peaGreen, "#FFFFFF", .2), ctx);
        x += text(formatLargeNumber(+tier.absorbsDamage.maxDamage.toFixed(2)) + " dmg ", x, newY, 15, mixColors(colors.legendary, "#FFFFFF", .2), ctx);
        x += text("over " + +tier.absorbsDamage.period.toFixed(2) + "s", x, newY, 15, mixColors(colors.uncommon, "#FFFFFF", .2), ctx);
        newY += 17.5;
    }

    if (tier.shield > 0) {
        text("Shield: " + formatLargeNumber(+tier.shield.toFixed(2)), 10, newY, 15, mixColors(colors.mythic, "#FFFFFF", .2), ctx);
        newY += 17.5;
    }

    if (tier.boost !== undefined) {
        text("Boost: " + formatLargeNumber(+tier.boost.length.toFixed(2)), 10, newY, 15, mixColors(colors.rare, "#FFFFFF", .2), ctx);
        newY += 17.5;
    }

    if (tier.healBack > 0) {
        text("Heal Back: " + formatLargeNumber(+(tier.healBack * 100).toFixed(2)) + "%", 10, newY, 15, colors.inventory, ctx);
        newY += 17.5;
    }

    if (petal.extraLighting > 0) {
        text("Lighting: +" + +petal.extraLighting.toFixed(2), 10, newY, 15, colors.beeYellow, ctx);
        newY += 17.5;
    }

    if (petal.extraDamage !== undefined) {
        text("If target is between " + petal.extraDamage.minHp.toFixed(2) * 100 + "% and " + petal.extraDamage.maxHp.toFixed(2) * 100 + "%:", 10, newY, 15, colors.legendary, ctx);
        text("Extra Damage: " + formatLargeNumber(tier.damage.toFixed(2) * petal.extraDamage.multiplier.toFixed(2)), 10, newY + 17.5, 15, colors.legendary, ctx);
        newY += 17.5 * 2;
    }

    return canvas;
}

const cache = [];

export function petalTooltip(index, rarity) {
    if (!cache[index]) {
        cache[index] = [];
    }

    if (!cache[index][rarity]) {
        cache[index][rarity] = createPetalTooltip(index, rarity);
    }

    return cache[index][rarity];
}

export const pentagram = (() => {
    const canv = new OffscreenCanvas(256, 256);
    const ctx = canv.getContext("2d");

    ctx.translate(128, 128);
    ctx.scale(124, 124);

    const p = new Path2D("M0 1C.551 1 1 .551 1 0c0-.551-.449-1-1-1-.551 0-1 .449-1 1C-1 .551-.551 1 0 1zM0 .867c-.159 0-.308-.043-.436-.118l.431-.328L.436.749C.308.824.159.867 0 .867zM.318.469l-.195-.145L.245.235.318.469zM.283-.171l.261-.003-.215.156L.283-.171zM.034.197l-.04.029-.119-.085-.074-.055.079-.252.238-.002.077.244L.034.197zM-.135.325l-.183.139.07-.222.031.022L-.135.325zM-.333-.009l-.216-.154.263-.003L-.333-.009zM.867 0c0 .272-.126.515-.323.674l-.168-.535.467-.339C.859-.136.867-.069.867 0zM.801-.331l-.564.005-.161-.538C.404-.835.68-.623.801-.331zM-.001-.547l.07.223-.14.001L-.001-.547zM-.077-.864l-.162.543-.568.006C-.69-.615-.411-.834-.077-.864zM-.381.147l-.165.526c-.196-.159-.322-.402-.322-.673 0-.064.007-.126.02-.186L-.381.147z");
    ctx.strokeStyle = "rgba(255, 128, 100, 1)";
    ctx.lineWidth = .05;
    ctx.stroke(p);

    return (ctx = _ctx, k = performance.now() % 5000 / 5000) => {
        ctx.drawImage(canv, -1, -1, 2, 2);

        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const a = i / 4 * Math.PI;
            const r = k * (Math.sin(i * 5 + k * i + performance.now() / 1000) * .05 + 1);

            // Curve between the octagon
            ctx.quadraticCurveTo(Math.cos(a + Math.PI / 8) * r, Math.sin(a + Math.PI / 8) * r, Math.cos(a + Math.PI / 4) * r, Math.sin(a + Math.PI / 4) * r);
        }

        ctx.closePath();

        ctx.strokeStyle = "rgba(255, 128, 100, 1)";
        ctx.lineWidth = .075;
        ctx.stroke();
    }
})();